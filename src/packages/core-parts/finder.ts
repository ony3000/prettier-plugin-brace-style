import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import { z } from 'zod';

import type { Dict, NodeRange, BraceNode, NarrowedParserOptions } from './shared';
import { BraceType } from './shared';

type ASTNode = {
  type: string;
  range: NodeRange;
};

function isTypeof<T extends ZodTypeAny>(arg: unknown, expectedSchema: T): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}

function filterBraceNodes(
  nonCommentNodes: ASTNode[],
  prettierIgnoreNodes: ASTNode[],
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

  return braceNodes.filter(
    ({ type: braceType, range: [braceRangeStart, braceRangeEnd] }) =>
      [BraceType.OB, BraceType.OBTO, BraceType.CB].includes(braceType) &&
      ignoreRanges.every(
        ([ignoreRangeStart, ignoreRangeEnd]) =>
          !(ignoreRangeStart <= braceRangeStart && braceRangeEnd <= ignoreRangeEnd),
      ),
  );
}

export function findTargetBraceNodes(ast: any): BraceNode[] {
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

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
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
    const currentASTNode: ASTNode = {
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
          type: parentNode?.type === 'SwitchCase' ? BraceType.OBNT : BraceType.OB,
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
                name: z.string(),
              }),
            }),
          )
        ) {
          const offset = `switch (${node.discriminant.name}) `.length;
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
      case 'ClassDeclaration':
      case 'ClassExpression':
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'IfStatement':
      case 'ObjectMethod':
      case 'SwitchCase':
      case 'TSInterfaceDeclaration':
      case 'TSModuleDeclaration': {
        nonCommentNodes.push(currentASTNode);

        braceNodes.forEach((braceNode) => {
          const [, braceRangeEnd] = braceNode.range;

          if (currentNodeRangeEnd === braceRangeEnd && braceNode.type === BraceType.CB) {
            // eslint-disable-next-line no-param-reassign
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
            // eslint-disable-next-line no-param-reassign
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

  return filterBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesForVue(
  ast: any,
  options: NarrowedParserOptions,
  addon: Dict<(text: string, options: any) => any>,
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

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
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

    const [currentNodeRangeStart, currentNodeRangeEnd] = [
      node.sourceSpan.start.offset,
      node.sourceSpan.end.offset,
    ];
    const currentASTNode: ASTNode = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
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
          parentNode.type === 'element' &&
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
            if (addon.parseBabel) {
              const jsxStart = '<div className={';
              const jsxEnd = '}></div>';
              const attributeOffset = -jsxStart.length + node.valueSpan.start.offset + 1;

              const babelAst = addon.parseBabel(`${jsxStart}${node.value}${jsxEnd}`, {
                ...options,
                parser: 'babel',
              });
              const targetBraceNodesInAttribute = findTargetBraceNodes(babelAst).map<BraceNode>(
                ({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                  type,
                  range: [
                    braceNodeRangeStart + attributeOffset,
                    braceNodeRangeEnd + attributeOffset,
                  ],
                }),
              );

              braceNodes.push(...targetBraceNodesInAttribute);
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

          if (addon.parseTypescript) {
            const typescriptAst = addon.parseTypescript(node.children.at(0)?.value ?? '', {
              ...options,
              parser: 'typescript',
            });
            const targetBraceNodesInScript = findTargetBraceNodes(typescriptAst).map<BraceNode>(
              ({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                type,
                range: [braceNodeRangeStart + scriptOffset, braceNodeRangeEnd + scriptOffset],
              }),
            );

            braceNodes.push(...targetBraceNodesInScript);
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

  return filterBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}
