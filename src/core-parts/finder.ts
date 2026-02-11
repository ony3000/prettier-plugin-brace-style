import type { AST, ParserOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';
import { z } from 'zod';

import { type NodeRange, type BraceNode, BraceType, EOL, SPACE, TAB, isTypeof } from './utils';

type ASTNode = {
  type: string;
  start: number;
  end: number;
};

type CaseHandlerContext = {
  formattedText: string;
  options: ResolvedOptions;
  nonCommentNodes: ASTNode[];
  prettierIgnoreNodes: ASTNode[];
  braceNodes: BraceNode[];
  node: unknown;
  parentNode?: { kind: string; type?: undefined } | { kind?: undefined; type: string };
  currentASTNode: ASTNode;
};

type CaseHandlers = Partial<{
  [nodeType: string]: (ctx: CaseHandlerContext) => void;
}>;

type ParserCaseHandlers = Partial<{
  [parserName: string]: CaseHandlers;
}>;

function filterAndSortBraceNodes(
  nonCommentNodes: ASTNode[],
  prettierIgnoreNodes: ASTNode[],
  braceNodes: BraceNode[],
): BraceNode[] {
  const ignoreRanges = prettierIgnoreNodes.map<NodeRange>(
    ({ start: prettierIgnoreRangeStart, end: prettierIgnoreRangeEnd }) => {
      const ignoringNodeOrNot = nonCommentNodes
        .filter(({ start: nonCommentRangeStart }) => prettierIgnoreRangeEnd < nonCommentRangeStart)
        .sort(
          (
            { start: formerNodeRangeStart, end: formerNodeRangeEnd },
            { start: latterNodeRangeStart, end: latterNodeRangeEnd },
          ) =>
            formerNodeRangeStart - latterNodeRangeStart || latterNodeRangeEnd - formerNodeRangeEnd,
        )
        .at(0);

      return ignoringNodeOrNot
        ? [ignoringNodeOrNot.start, ignoringNodeOrNot.end]
        : [prettierIgnoreRangeStart, prettierIgnoreRangeEnd];
    },
  );

  return braceNodes
    .filter(
      ({ type: braceType, range: [braceRangeStart, braceRangeEnd] }) =>
        [BraceType.OB, BraceType.OBTO, BraceType.CB].includes(braceType) &&
        ignoreRanges.every(
          ([ignoreRangeStart, ignoreRangeEnd]) =>
            !(ignoreRangeStart <= braceRangeStart && braceRangeEnd <= ignoreRangeEnd),
        ),
    )
    .sort(
      ({ range: [formerNodeRangeStart] }, { range: [latterNodeRangeStart] }) =>
        formerNodeRangeStart - latterNodeRangeStart,
    );
}

function parseBabel(text: string, options: ParserOptions) {
  return babelParsers.babel.parse(text, options);
}

function parseTypescript(text: string, options: ParserOptions) {
  return typescriptParsers.typescript.parse(text, options);
}

function handleJavaScriptBlockStatement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  ctx.braceNodes.push({
    type: BraceType.OB,
    range: [ctx.currentASTNode.start, ctx.currentASTNode.start + 1],
  });
  ctx.braceNodes.push({
    type: ctx.parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
    range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
  });
}

function handleJavaScriptConditionalExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  ctx.braceNodes.forEach((braceNode) => {
    const [braceRangeStart, braceRangeEnd] = braceNode.range;

    if (
      ctx.currentASTNode.start <= braceRangeStart &&
      braceRangeEnd <= ctx.currentASTNode.end &&
      braceNode.type === BraceType.OB
    ) {
      braceNode.type = BraceType.OBTO;
    }
  });
}

function handleJavaScriptFile(ctx: CaseHandlerContext) {
  if (
    isTypeof(
      ctx.node,
      z.object({
        comments: z.array(
          z.object({
            type: z.string(),
            value: z.string(),
            start: z.number(),
            end: z.number(),
          }),
        ),
      }),
    )
  ) {
    ctx.node.comments.forEach((comment) => {
      if (comment.value.trim() === 'prettier-ignore') {
        ctx.prettierIgnoreNodes.push({
          type: comment.type,
          start: comment.start,
          end: comment.end,
        });
      }
    });
  }
}

function handleJavaScriptFunctionExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  ctx.braceNodes.forEach((braceNode) => {
    const [, braceRangeEnd] = braceNode.range;

    if (ctx.currentASTNode.end === braceRangeEnd && braceNode.type === BraceType.CB) {
      braceNode.type = BraceType.CBNT;
    }
  });
}

function handleJavaScriptStaticBlock(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  const offset = 'static '.length;
  const braceRangeStart = ctx.currentASTNode.start + offset;

  ctx.braceNodes.push({
    type: BraceType.OB,
    range: [braceRangeStart, braceRangeStart + 1],
  });
  ctx.braceNodes.push({
    type: BraceType.CBNT,
    range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
  });
}

function handleJavaScriptSwitchStatement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        discriminant: z.object({
          start: z.number(),
          end: z.number(),
        }),
      }),
    )
  ) {
    const discriminantRangeStart = ctx.node.discriminant.start;
    const discriminantRangeEnd = ctx.node.discriminant.end;
    const isMultiLineExpression =
      discriminantRangeStart - ctx.currentASTNode.start > 'switch ('.length;

    // biome-ignore lint/style/noNonNullAssertion: When splitting with a non-empty string, the last element in the result array exists even if the input string is empty.
    const discriminantStartColumn = ctx.formattedText
      .slice(0, ctx.node.discriminant.start)
      .split(EOL)
      .at(-1)!.length;

    const indentUnit = ctx.options.useTabs ? TAB : SPACE.repeat(ctx.options.tabWidth);
    const indentLevelOfDiscriminant = discriminantStartColumn / indentUnit.length;

    const offset =
      'switch ('.length +
      // Length between '(' and `discriminantRangeStart`
      (discriminantRangeStart - ctx.currentASTNode.start - 'switch ('.length) +
      // Length of the discriminant
      (discriminantRangeEnd - discriminantRangeStart) +
      // Length between `discriminantRangeEnd` and ')'
      (isMultiLineExpression
        ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
        : 0) +
      ') '.length;

    const braceRangeStart = ctx.currentASTNode.start + offset;

    ctx.braceNodes.push({
      type: BraceType.OB,
      range: [braceRangeStart, braceRangeStart + 1],
    });
    ctx.braceNodes.push({
      type: BraceType.CBNT,
      range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
    });
  }
}

function handleTypeScriptBlock(ctx: CaseHandlerContext) {
  if (
    isTypeof(
      ctx.node,
      z.object({
        value: z.string(),
      }),
    ) &&
    ctx.node.value.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleTypeScriptTSEnumDeclaration(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        id: z.object({
          name: z.string(),
        }),
        declare: z.boolean().optional(),
        const: z.boolean().optional(),
      }),
    )
  ) {
    const offset = `${ctx.node.declare ? 'declare ' : ''}${ctx.node.const ? 'const ' : ''}enum ${
      ctx.node.id.name
    } `.length;
    const braceRangeStart = ctx.currentASTNode.start + offset;

    ctx.braceNodes.push({
      type: BraceType.OB,
      range: [braceRangeStart, braceRangeStart + 1],
    });
    ctx.braceNodes.push({
      type: BraceType.CBNT,
      range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
    });
  }
}

function handleSvelteComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(
      ctx.node,
      z.object({
        data: z.string(),
      }),
    ) &&
    ctx.node.data.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleSvelteRefinedScript(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        content: z.object({
          start: z.number(),
          value: z.string(),
        }),
      }),
    )
  ) {
    const textNodeInScript = ctx.node.content;
    if (textNodeInScript) {
      const openingTagEndingOffset = textNodeInScript.start;

      const subText = textNodeInScript.value;
      const subOptions = {
        ...ctx.options,
        parser: 'typescript',
      };
      const typescriptAst = parseTypescript(subText, subOptions);
      const targetBraceNodesInScript = findTargetBraceNodesBasedOnJavaScript(
        subText,
        typescriptAst,
        subOptions,
      ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
        type,
        range: [
          braceNodeRangeStart + openingTagEndingOffset,
          braceNodeRangeEnd + openingTagEndingOffset,
        ],
      }));

      ctx.braceNodes.push(...targetBraceNodesInScript);
    }
  }
}

function handleHtmlElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        startSourceSpan: z.object({
          end: z.object({
            offset: z.number(),
          }),
        }),
        name: z.string(),
        children: z.array(
          z.object({
            value: z.string(),
          }),
        ),
        attrs: z.array(
          z.object({
            name: z.string(),
            value: z.unknown(),
          }),
        ),
      }),
    ) &&
    ctx.node.name === 'script'
  ) {
    const textNodeInScript = ctx.node.children.at(0);

    if (ctx.node.attrs.find((attr) => attr.name === 'lang' && attr.value === 'ts')) {
      if (textNodeInScript) {
        const openingTagEndingOffset = ctx.node.startSourceSpan.end.offset;

        const subText = textNodeInScript.value;
        const subOptions = {
          ...ctx.options,
          parser: 'typescript',
        };
        const typescriptAst = parseTypescript(subText, subOptions);
        const targetBraceNodesInScript = findTargetBraceNodesBasedOnJavaScript(
          subText,
          typescriptAst,
          subOptions,
        ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
          type,
          range: [
            braceNodeRangeStart + openingTagEndingOffset,
            braceNodeRangeEnd + openingTagEndingOffset,
          ],
        }));

        ctx.braceNodes.push(...targetBraceNodesInScript);
      }
    } else if (
      ctx.node.attrs.find(
        (attr) => attr.name === 'type' && (attr.value === '' || attr.value === 'text/javascript'),
      ) ||
      !ctx.node.attrs.find((attr) => attr.name === 'type')
    ) {
      if (textNodeInScript) {
        const openingTagEndingOffset = ctx.node.startSourceSpan.end.offset;

        const subText = textNodeInScript.value;
        const subOptions = {
          ...ctx.options,
          parser: 'babel',
        };
        const babelAst = parseBabel(subText, subOptions);
        const targetBraceNodesInScript = findTargetBraceNodesBasedOnJavaScript(
          subText,
          babelAst,
          subOptions,
        ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
          type,
          range: [
            braceNodeRangeStart + openingTagEndingOffset,
            braceNodeRangeEnd + openingTagEndingOffset,
          ],
        }));

        ctx.braceNodes.push(...targetBraceNodesInScript);
      }
    }
  }
}

function handleAngularAngularControlFlowBlock(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        name: z.string(),
        startSourceSpan: z.object({
          end: z.object({
            offset: z.number(),
          }),
        }),
        endSourceSpan: z.object({
          start: z.object({
            offset: z.number(),
          }),
        }),
      }),
    )
  ) {
    switch (ctx.node.name) {
      case 'defer':
      case 'placeholder':
      case 'loading':
      case 'for':
      case 'if':
      case 'else if': {
        ctx.braceNodes.push({
          type: BraceType.OB,
          range: [ctx.node.startSourceSpan.end.offset - 1, ctx.node.startSourceSpan.end.offset],
        });
        ctx.braceNodes.push({
          type: BraceType.CB,
          range: [ctx.node.endSourceSpan.start.offset, ctx.node.endSourceSpan.start.offset + 1],
        });
        break;
      }
      case 'error':
      case 'empty':
      case 'else':
      case 'switch':
      case 'case':
      case 'default': {
        ctx.braceNodes.push({
          type: BraceType.OB,
          range: [ctx.node.startSourceSpan.end.offset - 1, ctx.node.startSourceSpan.end.offset],
        });
        ctx.braceNodes.push({
          type: BraceType.CBNT,
          range: [ctx.node.endSourceSpan.start.offset, ctx.node.endSourceSpan.start.offset + 1],
        });
        break;
      }
      default: {
        break;
      }
    }
  }
}

function handleVueAttribute(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  const bindDirectiveRegExp = /^(?:v-bind:|:)/;
  const onDirectiveRegExp = /^(?:v-on:|@)/;

  if (
    isTypeof(
      ctx.parentNode,
      z.object({
        sourceSpan: z.object({
          start: z.object({
            line: z.number(),
          }),
        }),
      }),
    ) &&
    (ctx.parentNode?.kind ?? ctx.parentNode?.type) === 'element' &&
    isTypeof(
      ctx.node,
      z.object({
        sourceSpan: z.object({
          start: z.object({
            line: z.number(),
          }),
        }),
        name: z.string(),
        value: z.string(),
        valueSpan: z.object({
          start: z.object({
            offset: z.number(),
          }),
          end: z.object({
            offset: z.number(),
          }),
        }),
      }),
    )
  ) {
    const hasBindDirective = ctx.node.name.match(bindDirectiveRegExp) !== null;
    const hasOnDirective = ctx.node.name.match(onDirectiveRegExp) !== null;

    if (hasBindDirective || hasOnDirective) {
      try {
        const jsxStart = '<div className={';
        const jsxEnd = '}></div>';
        const attributeOffset = -jsxStart.length + ctx.node.valueSpan.start.offset + 1;

        const subText = `${jsxStart}${ctx.node.value}${jsxEnd}`;
        const subOptions = {
          ...ctx.options,
          parser: 'babel',
        };
        const babelAst = parseBabel(subText, subOptions);
        const targetBraceNodesInAttribute = findTargetBraceNodesBasedOnJavaScript(
          subText,
          babelAst,
          subOptions,
        ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
          type,
          range: [braceNodeRangeStart + attributeOffset, braceNodeRangeEnd + attributeOffset],
        }));

        ctx.braceNodes.push(...targetBraceNodesInAttribute);
      } catch (_) {
        // no action
      }
    }
  }
}

function handleVueElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        sourceSpan: z.object({
          start: z.object({
            line: z.number(),
          }),
        }),
        startSourceSpan: z.object({
          end: z.object({
            offset: z.number(),
          }),
        }),
        name: z.string(),
        children: z.array(
          z.object({
            value: z.string(),
          }),
        ),
      }),
    ) &&
    ctx.node.name === 'script'
  ) {
    const scriptOffset = ctx.node.startSourceSpan.end.offset;

    const subText = ctx.node.children.at(0)?.value ?? '';
    const subOptions = {
      ...ctx.options,
      parser: 'typescript',
    };
    const typescriptAst = parseTypescript(subText, subOptions);
    const targetBraceNodesInScript = findTargetBraceNodesBasedOnJavaScript(
      subText,
      typescriptAst,
      subOptions,
    ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
      type,
      range: [braceNodeRangeStart + scriptOffset, braceNodeRangeEnd + scriptOffset],
    }));

    ctx.braceNodes.push(...targetBraceNodesInScript);
  }
}

function handleCssCssAtrule(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        name: z.string(),
        params: z.string(),
      }),
    )
  ) {
    const offset = `@${ctx.node.name}${SPACE}${ctx.node.params}${SPACE}`.length;
    const braceRangeStart = ctx.currentASTNode.start + offset;

    ctx.braceNodes.push({
      type: BraceType.OB,
      range: [braceRangeStart, braceRangeStart + 1],
    });
    ctx.braceNodes.push({
      type: BraceType.CBNT,
      range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
    });
  }
}

function handleCssCssRule(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        raws: z.object({
          selector: z.string(),
        }),
      }),
    )
  ) {
    const offset = `${ctx.node.raws.selector}${SPACE}`.length;
    const braceRangeStart = ctx.currentASTNode.start + offset;

    ctx.braceNodes.push({
      type: BraceType.OB,
      range: [braceRangeStart, braceRangeStart + 1],
    });
    ctx.braceNodes.push({
      type: BraceType.CBNT,
      range: [ctx.currentASTNode.end - 1, ctx.currentASTNode.end],
    });
  }
}

function handleAstroFrontmatter(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        value: z.string(),
      }),
    )
  ) {
    const subText = ctx.node.value;
    const subOptions = {
      ...ctx.options,
      parser: 'typescript',
    };
    const typescriptAst = parseTypescript(subText, subOptions);
    const targetBraceNodesInFrontMatter = findTargetBraceNodesBasedOnJavaScript(
      subText,
      typescriptAst,
      subOptions,
    ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => {
      const frontMatterOffset = '---'.length;

      return {
        type,
        range: [braceNodeRangeStart + frontMatterOffset, braceNodeRangeEnd + frontMatterOffset],
      };
    });

    ctx.braceNodes.push(...targetBraceNodesInFrontMatter);
  }
}

function handleAstroElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(
      ctx.node,
      z.object({
        name: z.literal('script'),
        attributes: z.array(
          z.object({
            type: z.literal('attribute'),
            kind: z.string(),
            name: z.string(),
            raw: z.string(),
          }),
        ),
        children: z.array(
          z.object({
            type: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
  ) {
    const openingTagStart = '<script';
    const openingTagEnd = '>';
    const openingTagAttributes = ctx.node.attributes.reduce(
      (prevAttributes, { kind, name, raw }) => {
        const currentAttribute = `${name}${kind === 'empty' ? '' : `=${raw}`}`;

        return `${prevAttributes} ${currentAttribute}`;
      },
      '',
    );
    const openingTagOffset = `${openingTagStart}${openingTagAttributes}${openingTagEnd}`.length;

    ctx.node.children.forEach(({ type, value }) => {
      if (type === 'text') {
        const subText = value;
        const subOptions = {
          ...ctx.options,
          parser: 'typescript',
        };
        const typescriptAst = parseTypescript(subText, subOptions);
        const targetBraceNodesInScript = findTargetBraceNodesBasedOnJavaScript(
          subText,
          typescriptAst,
          subOptions,
        ).map<BraceNode>(
          ({ type: braceType, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
            type: braceType,
            range: [
              braceNodeRangeStart + ctx.currentASTNode.start + openingTagOffset,
              braceNodeRangeEnd + ctx.currentASTNode.start + openingTagOffset,
            ],
          }),
        );

        ctx.braceNodes.push(...targetBraceNodesInScript);
      }
    });
  }
}

function handleAstroComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(
      ctx.node,
      z.object({
        value: z.string(),
      }),
    ) &&
    ctx.node.value.trim() === 'prettier-ignore'
  ) {
    const rangeStart = ctx.currentASTNode.start;
    const rangeEnd = ctx.currentASTNode.end;
    const commentOffset = '<!--'.length;

    ctx.prettierIgnoreNodes.push({
      ...ctx.currentASTNode,
      start: rangeStart - commentOffset,
      end: rangeEnd,
    });
  }
}

const babelCaseHandlers: CaseHandlers = {
  BlockStatement: handleJavaScriptBlockStatement,
  ClassBody: handleJavaScriptBlockStatement,
  StaticBlock: handleJavaScriptStaticBlock,
  SwitchStatement: handleJavaScriptSwitchStatement,
  ArrowFunctionExpression: handleJavaScriptFunctionExpression,
  ClassExpression: handleJavaScriptFunctionExpression,
  FunctionExpression: handleJavaScriptFunctionExpression,
  ConditionalExpression: handleJavaScriptConditionalExpression,
};

const typescriptCaseHandlers: CaseHandlers = {
  ...babelCaseHandlers,
  TSInterfaceBody: handleJavaScriptBlockStatement,
  TSModuleBlock: handleJavaScriptBlockStatement,
  TSEnumDeclaration: handleTypeScriptTSEnumDeclaration,
  Block: handleTypeScriptBlock,
  Line: handleTypeScriptBlock,
};

const parserCaseHandlers: ParserCaseHandlers = {
  babel: {
    ...babelCaseHandlers,
    ObjectMethod: handleJavaScriptFunctionExpression,
    File: handleJavaScriptFile,
  },
  'babel-ts': {
    ...babelCaseHandlers,
    ObjectMethod: handleJavaScriptFunctionExpression,
    File: handleJavaScriptFile,
    TSEnumBody: handleJavaScriptBlockStatement,
    TSInterfaceBody: handleJavaScriptBlockStatement,
    TSModuleBlock: handleJavaScriptBlockStatement,
  },
  typescript: {
    ...typescriptCaseHandlers,
  },
  oxc: {
    ...babelCaseHandlers,
    ObjectMethod: handleJavaScriptFunctionExpression,
    Program: handleJavaScriptFile,
  },
  'oxc-ts': {
    ...typescriptCaseHandlers,
  },
  svelte: {
    ...babelCaseHandlers,
    Block: handleTypeScriptBlock,
    Line: handleTypeScriptBlock,
    Comment: handleSvelteComment,
    RefinedScript: handleSvelteRefinedScript,
  },
  html: {
    comment: handleTypeScriptBlock,
    element: handleHtmlElement,
  },
  angular: {
    comment: handleTypeScriptBlock,
    element: handleHtmlElement,
    angularControlFlowBlock: handleAngularAngularControlFlowBlock,
  },
  vue: {
    comment: handleTypeScriptBlock,
    attribute: handleVueAttribute,
    element: handleVueElement,
  },
  css: {
    'css-atrule': handleCssCssAtrule,
    'css-rule': handleCssCssRule,
  },
  astro: {
    frontmatter: handleAstroFrontmatter,
    element: handleAstroElement,
    comment: handleAstroComment,
  },
};

export function findTargetBraceNodesBasedOnJavaScript(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode, node);
        });
        return;
      }

      recursion(value, node);
    });

    if (
      isTypeof(
        node,
        z.object({
          start: z.undefined(),
          end: z.undefined(),
          range: z.custom<NodeRange>((value) => isTypeof(value, z.tuple([z.number(), z.number()]))),
        }),
      )
    ) {
      const [rangeStart, rangeEnd] = node.range;

      // @ts-expect-error: Make the structure of the AST consistent.
      node.start = rangeStart;
      // @ts-expect-error: Make the structure of the AST consistent.
      node.end = rangeEnd;
    }

    if (
      !isTypeof(
        node,
        z.object({
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        nonCommentNodes,
        prettierIgnoreNodes,
        braceNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      if (nodeType !== 'JSXText') {
        nonCommentNodes.push(currentASTNode);
      }
    }
  }

  // NOTE: The top node of the Svelte AST does not have a type property.
  if (!ast.type) {
    ast.type = 'Root';
  }
  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesBasedOnHtml(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(
    node: unknown,
    parentNode?: { kind: string; type?: undefined } | { kind?: undefined; type: string },
  ): void {
    if (
      !isTypeof(node, z.object({ kind: z.string() })) &&
      !isTypeof(node, z.object({ type: z.string() }))
    ) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'kind' || key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode, node);
        });
        return;
      }

      recursion(value, node);
    });

    if (
      !isTypeof(
        node,
        z.object({
          sourceSpan: z.object({
            start: z.object({
              offset: z.number(),
            }),
            end: z.object({
              offset: z.number(),
            }),
          }),
        }),
      )
    ) {
      return;
    }

    const nodeType = isTypeof(node, z.object({ kind: z.string() })) ? node.kind : node.type;
    const currentNodeRangeStart = node.sourceSpan.start.offset;
    const currentNodeRangeEnd = node.sourceSpan.end.offset;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        nonCommentNodes,
        prettierIgnoreNodes,
        braceNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      nonCommentNodes.push(currentASTNode);
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesBasedOnCss(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode, node);
        });
        return;
      }

      recursion(value, node);
    });

    if (
      !isTypeof(
        node,
        z.object({
          source: z.object({
            startOffset: z.number(),
            endOffset: z.number(),
          }),
        }),
      )
    ) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart = node.source.startOffset;
    const currentNodeRangeEnd = node.source.endOffset;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        nonCommentNodes,
        prettierIgnoreNodes,
        braceNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      nonCommentNodes.push(currentASTNode);
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesBasedOnAstro(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode, node);
        });
        return;
      }

      recursion(value, node);
    });

    if (
      !isTypeof(
        node,
        z.object({
          position: z.object({
            start: z.object({
              offset: z.number(),
            }),
            end: z
              .object({
                offset: z.number(),
              })
              .optional(),
          }),
          name: z.unknown(),
          value: z.unknown(),
        }),
      )
    ) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart = node.position.start.offset;
    const currentNodeRangeEnd = node.position.end
      ? node.position.end.offset
      : node.position.start.offset +
        (nodeType === 'attribute' ? `${node.name}=?${node.value}?`.length : `${node.value}`.length);

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        nonCommentNodes,
        prettierIgnoreNodes,
        braceNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      if (nodeType !== 'text') {
        nonCommentNodes.push(currentASTNode);
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}
