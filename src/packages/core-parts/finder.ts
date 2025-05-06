import { z } from 'zod';

import type { Dict, NodeRange, BraceNode } from './shared';
import { BraceType, isTypeof } from './shared';

const EOL = '\n';

const SPACE = ' ';

const TAB = '\t';

type ASTNode = {
  type: string;
  range: NodeRange;
};

function filterAndSortBraceNodes(
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

export function findTargetBraceNodes(ast: any, options: ResolvedOptions): BraceNode[] {
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
      case 'ClassDeclaration':
      case 'ClassExpression':
      case 'ClassMethod':
      case 'ForStatement':
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'IfStatement':
      case 'ObjectMethod':
      case 'SwitchCase':
      case 'WhileStatement':
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

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesForHtml(
  ast: any,
  options: ResolvedOptions,
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

  function recursion(
    node: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parentNode?: { type?: unknown },
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
            if (addon.parseTypescript && textNodeInScript) {
              const openingTagEndingOffset = node.startSourceSpan.end.offset;

              const typescriptAst = addon.parseTypescript(textNodeInScript.value, {
                ...options,
                parser: 'typescript',
              });
              const targetBraceNodesInScript = findTargetBraceNodes(
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
            if (addon.parseBabel && textNodeInScript) {
              const openingTagEndingOffset = node.startSourceSpan.end.offset;

              const babelAst = addon.parseBabel(textNodeInScript.value, {
                ...options,
                parser: 'babel',
              });
              const targetBraceNodesInScript = findTargetBraceNodes(
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

export function findTargetBraceNodesForVue(
  ast: any,
  options: ResolvedOptions,
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
              try {
                const jsxStart = '<div className={';
                const jsxEnd = '}></div>';
                const attributeOffset = -jsxStart.length + node.valueSpan.start.offset + 1;

                const babelAst = addon.parseBabel(`${jsxStart}${node.value}${jsxEnd}`, {
                  ...options,
                  parser: 'babel',
                });
                const targetBraceNodesInAttribute = findTargetBraceNodes(
                  babelAst,
                  options,
                ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
                  type,
                  range: [
                    braceNodeRangeStart + attributeOffset,
                    braceNodeRangeEnd + attributeOffset,
                  ],
                }));

                braceNodes.push(...targetBraceNodesInAttribute);
              } catch (error) {
                // no action
              }
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
            const targetBraceNodesInScript = findTargetBraceNodes(
              typescriptAst,
              options,
            ).map<BraceNode>(({ type, range: [braceNodeRangeStart, braceNodeRangeEnd] }) => ({
              type,
              range: [braceNodeRangeStart + scriptOffset, braceNodeRangeEnd + scriptOffset],
            }));

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

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}

export function findTargetBraceNodesForAstro(
  ast: any,
  options: ResolvedOptions,
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

  function recursion(
    node: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parentNode?: { type?: unknown },
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
    const currentASTNode: ASTNode = {
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
          if (addon.parseTypescript) {
            const typescriptAst = addon.parseTypescript(node.value, {
              ...options,
              parser: 'typescript',
            });
            const targetBraceNodesInFrontMatter = findTargetBraceNodes(
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
          if (addon.parseTypescript) {
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
                const typescriptAst = addon.parseTypescript!(value, {
                  ...options,
                  parser: 'typescript',
                });
                const targetBraceNodesInFrontMatter = findTargetBraceNodes(
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

export function findTargetBraceNodesForSvelte(ast: any, options: ResolvedOptions): BraceNode[] {
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
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;
    const currentASTNode: ASTNode = {
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
    // eslint-disable-next-line no-param-reassign
    ast.type = 'Root';
  }
  recursion(ast);

  return filterAndSortBraceNodes(nonCommentNodes, prettierIgnoreNodes, braceNodes);
}
