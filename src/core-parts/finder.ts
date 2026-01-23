import type { AST, ParserOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';
import { z } from 'zod';

import { type NodeRange, type BraceNode, BraceType, EOL, SPACE, TAB, isTypeof } from './utils';

/**
 * @deprecated
 */
type ASTNodeLegacy = {
  type: string;
  range: NodeRange;
};

type ASTNode = {
  type: string;
  /**
   * @deprecated
   */
  range: NodeRange;
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
  nonCommentNodes: ASTNodeLegacy[],
  prettierIgnoreNodes: ASTNodeLegacy[],
  braceNodes: BraceNode[],
): BraceNode[] {
  const ignoreRanges = prettierIgnoreNodes.map<NodeRange>(({ range }) => {
    const [, prettierIgnoreRangeEnd] = range;

    const ignoringNodeOrNot = nonCommentNodes
      .filter(({ range: [nonCommentRangeStart] }) => prettierIgnoreRangeEnd < nonCommentRangeStart)
      .sort(
        (
          { range: [formerNodeRangeStart, formerNodeRangeEnd] },
          { range: [latterNodeRangeStart, latterNodeRangeEnd] },
        ) => formerNodeRangeStart - latterNodeRangeStart || latterNodeRangeEnd - formerNodeRangeEnd,
      )
      .at(0);

    return ignoringNodeOrNot?.range ?? range;
  });

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

/**
 * @deprecated
 */
export function findTargetBraceNodesForBabel(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: string }): void {
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

    // NOTE: This type of AST does not exist in Prettier versions less than 3.6.
    if (node.type === 'TSEnumBody') {
      if (
        isTypeof(
          node,
          z.object({
            start: z.undefined(),
            end: z.undefined(),
            range: z.custom<NodeRange>((value) =>
              isTypeof(value, z.tuple([z.number(), z.number()])),
            ),
          }),
        )
      ) {
        const [rangeStart, rangeEnd] = node.range;

        // @ts-expect-error: Handles babel-ts parser cases in Prettier version 3.6.
        node.start = rangeStart;
        // @ts-expect-error: Handles babel-ts parser cases in Prettier version 3.6.
        node.end = rangeEnd;
      }
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

    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'BlockStatement':
      case 'ClassBody': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'TSEnumBody':
      case 'TSInterfaceBody':
      case 'TSModuleBlock': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'StaticBlock': {
        nonCommentNodes.push(currentASTNode);

        const offset = 'static '.length;
        const braceRangeStart = currentNodeRangeStart + offset;

        braceNodes.push({
          type: BraceType.OB,
          range: [braceRangeStart, braceRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'SwitchStatement': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              discriminant: z.object({
                start: z.number(),
                end: z.number(),
                loc: z.object({
                  start: z.object({
                    column: z.number(),
                  }),
                }),
              }),
            }),
          )
        ) {
          const discriminantRangeStart = node.discriminant.start;
          const discriminantRangeEnd = node.discriminant.end;
          const isMultiLineExpression =
            discriminantRangeStart - currentNodeRangeStart > 'switch ('.length;

          const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);
          const indentLevelOfDiscriminant = node.discriminant.loc.start.column / indentUnit.length;

          const offset =
            'switch ('.length +
            // Length between '(' and `discriminantRangeStart`
            (discriminantRangeStart - currentNodeRangeStart - 'switch ('.length) +
            // Length of the discriminant
            (discriminantRangeEnd - discriminantRangeStart) +
            // Length between `discriminantRangeEnd` and ')'
            (isMultiLineExpression
              ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
              : 0) +
            ') '.length;

          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'ArrowFunctionExpression':
      case 'ClassExpression':
      case 'FunctionExpression':
      case 'ObjectMethod': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            braceNode.type = BraceType.CBNT;
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [braceRangeStart, braceRangeEnd] = braceNode.range;

          if (
            currentNodeRangeStart <= braceRangeStart &&
            braceRangeEnd <= currentNodeRangeEnd &&
            braceNode.type === BraceType.OB
          ) {
            braceNode.type = BraceType.OBTO;
          }
        });
        break;
      }
      case 'File': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          node.comments.forEach((comment) => {
            if (comment.value.trim() === 'prettier-ignore') {
              prettierIgnoreNodes.push({
                type: comment.type,
                range: [comment.start, comment.end],
              });
            }
          });
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForOxc(
  ast: AST,
  options: ResolvedOptions,
  formattedText: string,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: string }): void {
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
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'BlockStatement':
      case 'ClassBody': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'StaticBlock': {
        nonCommentNodes.push(currentASTNode);

        const offset = 'static '.length;
        const braceRangeStart = currentNodeRangeStart + offset;

        braceNodes.push({
          type: BraceType.OB,
          range: [braceRangeStart, braceRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'SwitchStatement': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              discriminant: z.object({
                start: z.number(),
                end: z.number(),
              }),
            }),
          )
        ) {
          const discriminantRangeStart = node.discriminant.start;
          const discriminantRangeEnd = node.discriminant.end;
          const isMultiLineExpression =
            discriminantRangeStart - currentNodeRangeStart > 'switch ('.length;

          // biome-ignore lint/style/noNonNullAssertion: When splitting with a non-empty string, the last element in the result array exists even if the input string is empty.
          const discriminantStartColumn = formattedText
            .slice(0, node.discriminant.start)
            .split(EOL)
            .at(-1)!.length;

          const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);
          const indentLevelOfDiscriminant = discriminantStartColumn / indentUnit.length;

          const offset =
            'switch ('.length +
            // Length between '(' and `discriminantRangeStart`
            (discriminantRangeStart - currentNodeRangeStart - 'switch ('.length) +
            // Length of the discriminant
            (discriminantRangeEnd - discriminantRangeStart) +
            // Length between `discriminantRangeEnd` and ')'
            (isMultiLineExpression
              ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
              : 0) +
            ') '.length;

          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'ArrowFunctionExpression':
      case 'ClassExpression':
      case 'FunctionExpression':
      case 'ObjectMethod': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            braceNode.type = BraceType.CBNT;
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [braceRangeStart, braceRangeEnd] = braceNode.range;

          if (
            currentNodeRangeStart <= braceRangeStart &&
            braceRangeEnd <= currentNodeRangeEnd &&
            braceNode.type === BraceType.OB
          ) {
            braceNode.type = BraceType.OBTO;
          }
        });
        break;
      }
      case 'Program': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          node.comments.forEach((comment) => {
            if (comment.value.trim() === 'prettier-ignore') {
              prettierIgnoreNodes.push({
                type: comment.type,
                range: [comment.start, comment.end],
              });
            }
          });
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForTypeScript(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: string }): void {
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
          range: z.custom<NodeRange>((value) => isTypeof(value, z.tuple([z.number(), z.number()]))),
        }),
      )
    ) {
      return;
    }

    const [currentNodeRangeStart, currentNodeRangeEnd] = node.range;
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: node.range,
    };

    switch (node.type) {
      case 'BlockStatement':
      case 'ClassBody':
      case 'TSInterfaceBody':
      case 'TSModuleBlock': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'StaticBlock': {
        nonCommentNodes.push(currentASTNode);

        const offset = 'static '.length;
        const braceRangeStart = currentNodeRangeStart + offset;

        braceNodes.push({
          type: BraceType.OB,
          range: [braceRangeStart, braceRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'SwitchStatement': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              discriminant: z.object({
                range: z.custom<NodeRange>((value) =>
                  isTypeof(value, z.tuple([z.number(), z.number()])),
                ),
                loc: z.object({
                  start: z.object({
                    column: z.number(),
                  }),
                }),
              }),
            }),
          )
        ) {
          const [discriminantRangeStart, discriminantRangeEnd] = node.discriminant.range;
          const isMultiLineExpression =
            discriminantRangeStart - currentNodeRangeStart > 'switch ('.length;

          const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);
          const indentLevelOfDiscriminant = node.discriminant.loc.start.column / indentUnit.length;

          const offset =
            'switch ('.length +
            // Length between '(' and `discriminantRangeStart`
            (discriminantRangeStart - currentNodeRangeStart - 'switch ('.length) +
            // Length of the discriminant
            (discriminantRangeEnd - discriminantRangeStart) +
            // Length between `discriminantRangeEnd` and ')'
            (isMultiLineExpression
              ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
              : 0) +
            ') '.length;

          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'TSEnumDeclaration': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              id: z.object({
                name: z.string(),
              }),
              declare: z.boolean().optional(),
              const: z.boolean().optional(),
            }),
          )
        ) {
          const offset = `${node.declare ? 'declare ' : ''}${node.const ? 'const ' : ''}enum ${
            node.id.name
          } `.length;
          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'ArrowFunctionExpression':
      case 'ClassExpression':
      case 'FunctionExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            braceNode.type = BraceType.CBNT;
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [braceRangeStart, braceRangeEnd] = braceNode.range;

          if (
            currentNodeRangeStart <= braceRangeStart &&
            braceRangeEnd <= currentNodeRangeEnd &&
            braceNode.type === BraceType.OB
          ) {
            braceNode.type = BraceType.OBTO;
          }
        });
        break;
      }
      case 'Block':
      case 'Line': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForOxcTypeScript(
  ast: AST,
  options: ResolvedOptions,
  formattedText: string,
): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: string }): void {
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
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    const [currentNodeRangeStart, currentNodeRangeEnd] = [node.start, node.end];
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'BlockStatement':
      case 'ClassBody':
      case 'TSInterfaceBody':
      case 'TSModuleBlock': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'StaticBlock': {
        nonCommentNodes.push(currentASTNode);

        const offset = 'static '.length;
        const braceRangeStart = currentNodeRangeStart + offset;

        braceNodes.push({
          type: BraceType.OB,
          range: [braceRangeStart, braceRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'SwitchStatement': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              discriminant: z.object({
                start: z.number(),
                end: z.number(),
              }),
            }),
          )
        ) {
          const discriminantRangeStart = node.discriminant.start;
          const discriminantRangeEnd = node.discriminant.end;
          const isMultiLineExpression =
            discriminantRangeStart - currentNodeRangeStart > 'switch ('.length;

          // biome-ignore lint/style/noNonNullAssertion: When splitting with a non-empty string, the last element in the result array exists even if the input string is empty.
          const discriminantStartColumn = formattedText
            .slice(0, node.discriminant.start)
            .split(EOL)
            .at(-1)!.length;

          const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);
          const indentLevelOfDiscriminant = discriminantStartColumn / indentUnit.length;

          const offset =
            'switch ('.length +
            // Length between '(' and `discriminantRangeStart`
            (discriminantRangeStart - currentNodeRangeStart - 'switch ('.length) +
            // Length of the discriminant
            (discriminantRangeEnd - discriminantRangeStart) +
            // Length between `discriminantRangeEnd` and ')'
            (isMultiLineExpression
              ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
              : 0) +
            ') '.length;

          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'TSEnumDeclaration': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              id: z.object({
                name: z.string(),
              }),
              declare: z.boolean().optional(),
              const: z.boolean().optional(),
            }),
          )
        ) {
          const offset = `${node.declare ? 'declare ' : ''}${node.const ? 'const ' : ''}enum ${
            node.id.name
          } `.length;
          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'ArrowFunctionExpression':
      case 'ClassExpression':
      case 'FunctionExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            braceNode.type = BraceType.CBNT;
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [braceRangeStart, braceRangeEnd] = braceNode.range;

          if (
            currentNodeRangeStart <= braceRangeStart &&
            braceRangeEnd <= currentNodeRangeEnd &&
            braceNode.type === BraceType.OB
          ) {
            braceNode.type = BraceType.OBTO;
          }
        });
        break;
      }
      case 'Block':
      case 'Line': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForHtml(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(
    node: unknown,
    // biome-ignore lint/correctness/noUnusedFunctionParameters: Required for recursive calls.
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

    const [currentNodeRangeStart, currentNodeRangeEnd] = [
      node.sourceSpan.start.offset,
      node.sourceSpan.end.offset,
    ];
    const currentASTNode: ASTNodeLegacy = {
      type: nodeType,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (nodeType) {
      case 'angularControlFlowBlock': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          switch (node.name) {
            case 'defer':
            case 'placeholder':
            case 'loading':
            case 'for':
            case 'if':
            case 'else if': {
              braceNodes.push({
                type: BraceType.OB,
                range: [node.startSourceSpan.end.offset - 1, node.startSourceSpan.end.offset],
              });
              braceNodes.push({
                type: BraceType.CB,
                range: [node.endSourceSpan.start.offset, node.endSourceSpan.start.offset + 1],
              });
              break;
            }
            case 'error':
            case 'empty':
            case 'else':
            case 'switch':
            case 'case':
            case 'default': {
              braceNodes.push({
                type: BraceType.OB,
                range: [node.startSourceSpan.end.offset - 1, node.startSourceSpan.end.offset],
              });
              braceNodes.push({
                type: BraceType.CBNT,
                range: [node.endSourceSpan.start.offset, node.endSourceSpan.start.offset + 1],
              });
              break;
            }
            default: {
              break;
            }
          }
        }
        break;
      }
      case 'element': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          node.name === 'script'
        ) {
          const textNodeInScript = node.children.at(0);

          if (node.attrs.find((attr) => attr.name === 'lang' && attr.value === 'ts')) {
            if (textNodeInScript) {
              const openingTagEndingOffset = node.startSourceSpan.end.offset;

              const typescriptAst = parseTypescript(textNodeInScript.value, {
                ...options,
                parser: 'typescript',
              });
              const targetBraceNodesInScript = findTargetBraceNodesForTypeScript(
                typescriptAst,
                options,
              ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                type,
                range: [
                  braceNodeRangeStart + openingTagEndingOffset,
                  braceNodeRangeEnd + openingTagEndingOffset,
                ],
              }));

              braceNodes.push(...targetBraceNodesInScript);
            }
          } else if (
            node.attrs.find(
              (attr) =>
                attr.name === 'type' && (attr.value === '' || attr.value === 'text/javascript'),
            ) ||
            !node.attrs.find((attr) => attr.name === 'type')
          ) {
            if (textNodeInScript) {
              const openingTagEndingOffset = node.startSourceSpan.end.offset;

              const babelAst = parseBabel(textNodeInScript.value, {
                ...options,
                parser: 'babel',
              });
              const targetBraceNodesInScript = findTargetBraceNodesForBabel(
                babelAst,
                options,
              ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                type,
                range: [
                  braceNodeRangeStart + openingTagEndingOffset,
                  braceNodeRangeEnd + openingTagEndingOffset,
                ],
              }));

              braceNodes.push(...targetBraceNodesInScript);
            }
          }
        }
        break;
      }
      case 'comment': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        nonCommentNodes.push(currentASTNode);
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForVue(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
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
    const parentNodeType = parentNode?.kind ?? parentNode?.type;

    const [currentNodeRangeStart, currentNodeRangeEnd] = [
      node.sourceSpan.start.offset,
      node.sourceSpan.end.offset,
    ];
    const currentASTNode: ASTNodeLegacy = {
      type: nodeType,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (nodeType) {
      case 'attribute': {
        nonCommentNodes.push(currentASTNode);

        const bindDirectiveRegExp = /^(?:v-bind:|:)/;
        const onDirectiveRegExp = /^(?:v-on:|@)/;

        if (
          isTypeof(
            parentNode,
            z.object({
              sourceSpan: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
            }),
          ) &&
          parentNodeType === 'element' &&
          isTypeof(
            node,
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
          const hasBindDirective = node.name.match(bindDirectiveRegExp) !== null;
          const hasOnDirective = node.name.match(onDirectiveRegExp) !== null;

          if (hasBindDirective || hasOnDirective) {
            try {
              const jsxStart = '<div className={';
              const jsxEnd = '}></div>';
              const attributeOffset = -jsxStart.length + node.valueSpan.start.offset + 1;

              const babelAst = parseBabel(`${jsxStart}${node.value}${jsxEnd}`, {
                ...options,
                parser: 'babel',
              });
              const targetBraceNodesInAttribute = findTargetBraceNodesForBabel(
                babelAst,
                options,
              ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                type,
                range: [braceNodeRangeStart + attributeOffset, braceNodeRangeEnd + attributeOffset],
              }));

              braceNodes.push(...targetBraceNodesInAttribute);
            } catch (_) {
              // no action
            }
          }
        }
        break;
      }
      case 'element': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          node.name === 'script'
        ) {
          const scriptOffset = node.startSourceSpan.end.offset;

          const typescriptAst = parseTypescript(node.children.at(0)?.value ?? '', {
            ...options,
            parser: 'typescript',
          });
          const targetBraceNodesInScript = findTargetBraceNodesForTypeScript(
            typescriptAst,
            options,
          ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
            type,
            range: [braceNodeRangeStart + scriptOffset, braceNodeRangeEnd + scriptOffset],
          }));

          braceNodes.push(...targetBraceNodesInScript);
        }
        break;
      }
      case 'comment': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        nonCommentNodes.push(currentASTNode);
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForAstro(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(
    node: unknown,
    // biome-ignore lint/correctness/noUnusedFunctionParameters: Required for recursive calls.
    parentNode?: { type?: string },
  ): void {
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

    const currentNodeRangeStart = node.position.start.offset;
    const currentNodeRangeEnd = node.position.end
      ? node.position.end.offset
      : node.position.start.offset +
        (node.type === 'attribute'
          ? `${node.name}=?${node.value}?`.length
          : `${node.value}`.length);
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'frontmatter': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          )
        ) {
          const typescriptAst = parseTypescript(node.value, {
            ...options,
            parser: 'typescript',
          });
          const targetBraceNodesInFrontMatter = findTargetBraceNodesForTypeScript(
            typescriptAst,
            options,
          ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => {
            const frontMatterOffset = '---'.length;

            return {
              type,
              range: [
                braceNodeRangeStart + frontMatterOffset,
                braceNodeRangeEnd + frontMatterOffset,
              ],
            };
          });

          braceNodes.push(...targetBraceNodesInFrontMatter);
        }
        break;
      }
      case 'element': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
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
          const openingTagAttributes = node.attributes.reduce(
            (prevAttributes, { kind, name, raw }) => {
              const currentAttribute = `${name}${kind === 'empty' ? '' : `=${raw}`}`;

              return `${prevAttributes} ${currentAttribute}`;
            },
            '',
          );
          const openingTagOffset = `${openingTagStart}${openingTagAttributes}${openingTagEnd}`
            .length;

          node.children.forEach(({ type, value }) => {
            if (type === 'text') {
              const typescriptAst = parseTypescript(value, {
                ...options,
                parser: 'typescript',
              });
              const targetBraceNodesInFrontMatter = findTargetBraceNodesForTypeScript(
                typescriptAst,
                options,
              ).map<BraceNode>(
                ({ type: braceType, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                  type: braceType,
                  range: [
                    braceNodeRangeStart + currentNodeRangeStart + openingTagOffset,
                    braceNodeRangeEnd + currentNodeRangeStart + openingTagOffset,
                  ],
                }),
              );

              braceNodes.push(...targetBraceNodesInFrontMatter);
            }
          });
        }
        break;
      }
      case 'comment': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          const [rangeStart, rangeEnd] = currentASTNode.range;
          const commentOffset = '<!--'.length;

          prettierIgnoreNodes.push({
            ...currentASTNode,
            range: [rangeStart - commentOffset, rangeEnd],
          });
        }
        break;
      }
      default: {
        if (node.type !== 'text') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

/**
 * @deprecated
 */
export function findTargetBraceNodesForSvelte(ast: AST, options: ResolvedOptions): BraceNode[] {
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNodeLegacy[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNodeLegacy[] = [];
  /**
   * Single brace character as node
   */
  const braceNodes: BraceNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: string }): void {
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
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;
    const currentASTNode: ASTNodeLegacy = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'RefinedScript': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              content: z.object({
                start: z.number(),
                value: z.string(),
              }),
            }),
          )
        ) {
          const textNodeInScript = node.content;

          if (textNodeInScript) {
            const openingTagEndingOffset = textNodeInScript.start;

            const typescriptAst = parseTypescript(textNodeInScript.value, {
              ...options,
              parser: 'typescript',
            });
            const targetBraceNodesInScript = findTargetBraceNodesForTypeScript(
              typescriptAst,
              options,
            ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
              type,
              range: [
                braceNodeRangeStart + openingTagEndingOffset,
                braceNodeRangeEnd + openingTagEndingOffset,
              ],
            }));

            braceNodes.push(...targetBraceNodesInScript);
          }
        }
        break;
      }
      case 'BlockStatement':
      case 'ClassBody': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.push({
          type: BraceType.OB,
          range: [currentNodeRangeStart, currentNodeRangeStart + 1],
        });
        braceNodes.push({
          type: parentNode?.type === 'DoWhileStatement' ? BraceType.CBNT : BraceType.CB,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'StaticBlock': {
        nonCommentNodes.push(currentASTNode);

        const offset = 'static '.length;
        const braceRangeStart = currentNodeRangeStart + offset;

        braceNodes.push({
          type: BraceType.OB,
          range: [braceRangeStart, braceRangeStart + 1],
        });
        braceNodes.push({
          type: BraceType.CBNT,
          range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
        });
        break;
      }
      case 'SwitchStatement': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              discriminant: z.object({
                start: z.number(),
                end: z.number(),
                loc: z.object({
                  start: z.object({
                    column: z.number(),
                  }),
                }),
              }),
            }),
          )
        ) {
          const discriminantRangeStart = node.discriminant.start;
          const discriminantRangeEnd = node.discriminant.end;
          const isMultiLineExpression =
            discriminantRangeStart - currentNodeRangeStart > 'switch ('.length;

          const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);
          const indentLevelOfDiscriminant = node.discriminant.loc.start.column / indentUnit.length;

          const offset =
            'switch ('.length +
            // Length between '(' and `discriminantRangeStart`
            (discriminantRangeStart - currentNodeRangeStart - 'switch ('.length) +
            // Length of the discriminant
            (discriminantRangeEnd - discriminantRangeStart) +
            // Length between `discriminantRangeEnd` and ')'
            (isMultiLineExpression
              ? `${EOL}`.length + (indentLevelOfDiscriminant - 1) * indentUnit.length
              : 0) +
            ') '.length;

          const braceRangeStart = currentNodeRangeStart + offset;

          braceNodes.push({
            type: BraceType.OB,
            range: [braceRangeStart, braceRangeStart + 1],
          });
          braceNodes.push({
            type: BraceType.CBNT,
            range: [currentNodeRangeEnd - 1, currentNodeRangeEnd],
          });
        }
        break;
      }
      case 'ArrowFunctionExpression':
      case 'ClassExpression':
      case 'FunctionExpression':
      case 'IfStatement': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            braceNode.type = BraceType.CBNT;
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [braceRangeStart, braceRangeEnd] = braceNode.range;

          if (
            currentNodeRangeStart <= braceRangeStart &&
            braceRangeEnd <= currentNodeRangeEnd &&
            braceNode.type === BraceType.OB
          ) {
            braceNode.type = BraceType.OBTO;
          }
        });
        break;
      }
      case 'Block':
      case 'Line': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      case 'Comment': {
        if (
          isTypeof(
            node,
            z.object({
              data: z.string(),
            }),
          ) &&
          node.data.trim() === 'prettier-ignore'
        ) {
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        nonCommentNodes.push(currentASTNode);
        break;
      }
    }
  }

  if (!ast.type) {
    ast.type = 'Root';
  }
  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

// ----------------------------------------------------------------

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
          range: [comment.start, comment.end],
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

      const typescriptAst = parseTypescript(textNodeInScript.value, {
        ...ctx.options,
        parser: 'typescript',
      });
      const targetBraceNodesInScript = findTargetBraceNodesForTypeScript(
        typescriptAst,
        ctx.options,
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
      range: [currentNodeRangeStart, currentNodeRangeEnd],
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
