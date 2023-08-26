import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';

enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

type NodeRange = [number, number];

type LinePart = {
  type: string;
  body: string;
};

type LineNode = {
  indentLevel: number;
  parts: LinePart[];
};

type BraceNode = {
  type: BraceType;
  range: NodeRange;
};

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

function isNodeRange(arg: unknown): arg is NodeRange {
  return Array.isArray(arg) && arg.length === 2 && arg.every((item) => typeof item === 'number');
}

function findTargetBraceNodes(ast: any): BraceNode[] {
  const braceEnclosingRanges: NodeRange[] = [];
  const braceTypePerIndex: Record<string, BraceType> = {};

  function treatNextNodeAsPlainText(commentRange: NodeRange): void {
    const [, rangeEnd] = commentRange;

    const ignoringRange = braceEnclosingRanges
      .filter((nodeRange) => rangeEnd < nodeRange[0])
      .sort((former, latter) => former[0] - latter[0] || latter[1] - former[1])
      .at(0);

    if (ignoringRange) {
      Object.entries(braceTypePerIndex).forEach(([key, value]) => {
        const rangeStartOfBrace = Number(key);

        if (ignoringRange[0] <= rangeStartOfBrace && rangeStartOfBrace < ignoringRange[1]) {
          if (value === BraceType.OB || value === BraceType.OBTO) {
            braceTypePerIndex[key] = BraceType.OBNT;
          } else if (value === BraceType.CB) {
            braceTypePerIndex[key] = BraceType.CBNT;
          }
        }
      });
    }
  }

  function recursion(node: unknown, parentNode?: object & Record<'type', unknown>): void {
    if (!isObject(node) || !('type' in node)) {
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

    if (!('range' in node) || !isNodeRange(node.range)) {
      return;
    }

    const [rangeStart, rangeEnd] = node.range;

    switch (node.type) {
      case 'TSEnumDeclaration': {
        if ('id' in node && isObject(node.id) && 'name' in node.id) {
          const prefix = `${'declare' in node && node.declare ? 'declare ' : ''}${
            'const' in node && node.const ? 'const ' : ''
          }`;
          const offset = `${prefix}enum ${node.id.name} `.length;

          braceEnclosingRanges.push([rangeStart, rangeEnd]);
          braceTypePerIndex[rangeStart + offset] = BraceType.OB;
          braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
        }
        break;
      }
      case 'TSInterfaceBody':
      case 'TSModuleBlock':
      case 'BlockStatement':
      case 'ClassBody': {
        braceEnclosingRanges.push([rangeStart, rangeEnd]);
        braceTypePerIndex[rangeStart] = BraceType.OB;
        braceTypePerIndex[rangeEnd - 1] = BraceType.CB;
        if (parentNode?.type === 'SwitchCase') {
          braceTypePerIndex[rangeStart] = BraceType.OBNT;
        } else if (parentNode?.type === 'DoWhileStatement') {
          braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
        }
        break;
      }
      case 'StaticBlock': {
        const offset = 'static '.length;

        braceEnclosingRanges.push([rangeStart, rangeEnd]);
        braceTypePerIndex[rangeStart + offset] = BraceType.OB;
        braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
        break;
      }
      case 'SwitchStatement': {
        if ('discriminant' in node && isObject(node.discriminant) && 'name' in node.discriminant) {
          const offset = `switch (${node.discriminant.name}) `.length;

          braceEnclosingRanges.push([rangeStart, rangeEnd]);
          braceTypePerIndex[rangeStart + offset] = BraceType.OB;
          braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
        }
        break;
      }
      case 'ConditionalExpression': {
        braceEnclosingRanges.push([rangeStart, rangeEnd]);
        Object.entries(braceTypePerIndex).forEach(([key, value]) => {
          const rangeStartOfBrace = Number(key);

          if (
            rangeStart <= rangeStartOfBrace &&
            rangeStartOfBrace < rangeEnd &&
            value === BraceType.OB
          ) {
            braceTypePerIndex[key] = BraceType.OBTO;
          }
        });
        break;
      }
      case 'TSInterfaceDeclaration':
      case 'TSModuleDeclaration':
      case 'ArrowFunctionExpression':
      case 'ClassDeclaration':
      case 'ClassExpression':
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'IfStatement':
      case 'ObjectMethod':
      case 'SwitchCase': {
        braceEnclosingRanges.push([rangeStart, rangeEnd]);
        braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
        break;
      }
      case 'Block':
      case 'Line': {
        if (
          'value' in node &&
          typeof node.value === 'string' &&
          node.value.trim() === 'prettier-ignore'
        ) {
          treatNextNodeAsPlainText([rangeStart, rangeEnd]);
        }
        break;
      }
      case 'File': {
        if ('comments' in node && Array.isArray(node.comments)) {
          node.comments.forEach((comment: unknown) => {
            if (
              isObject(comment) &&
              'start' in comment &&
              typeof comment.start === 'number' &&
              'end' in comment &&
              typeof comment.end === 'number' &&
              'value' in comment &&
              typeof comment.value === 'string' &&
              comment.value.trim() === 'prettier-ignore'
            ) {
              treatNextNodeAsPlainText([comment.start, comment.end]);
            }
          });
        }
        break;
      }
      default: {
        // nothing to do
        break;
      }
    }
  }

  recursion(ast);

  return Object.entries(braceTypePerIndex)
    .map<BraceNode>(([key, value]) => {
      const rangeStart = Number(key);

      return { type: value, range: [rangeStart, rangeStart + 1] };
    })
    .filter(
      (item) =>
        item.type === BraceType.OB || item.type === BraceType.OBTO || item.type === BraceType.CB,
    )
    .sort((former, latter) => former.range[0] - latter.range[0]);
}

function parseLineByLineAndAssemble(
  formattedText: string,
  ast: any,
  options: ParserOptions,
): string {
  // @ts-ignore
  if (formattedText === '' || options.braceStyle === '1tbs') {
    return formattedText;
  }

  const EOL = '\n';
  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  const targetBraceNodes = findTargetBraceNodes(ast);
  const formattedLines = formattedText.split(EOL);
  let rangeStartOfLine = 0;
  let rangeEndOfLine: number;

  const lineNodes: LineNode[] = formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    rangeEndOfLine = rangeStartOfLine + line.length;

    const braceNodesInCurrentLine = targetBraceNodes.filter(
      ({ range: [rangeStartOfBrace, rangeEndOfBrace] }) =>
        rangeStartOfLine <= rangeStartOfBrace && rangeEndOfBrace <= rangeEndOfLine,
    );
    const parts: LinePart[] = [];
    let maybeLastPart: LinePart | null = null;

    const offset = indentUnit.length * indentLevel;
    const trimmedLine = line.slice(offset); // base of 'mutableLine'
    let mutableLine = trimmedLine;

    if (braceNodesInCurrentLine.length === 0) {
      parts.push({
        type: 'Text',
        body: mutableLine,
      });
    } else {
      const lastBraceNodeInCurrentLine = braceNodesInCurrentLine.pop()!;

      if (
        lastBraceNodeInCurrentLine.type === BraceType.OB ||
        lastBraceNodeInCurrentLine.type === BraceType.OBTO
      ) {
        maybeLastPart = {
          type: lastBraceNodeInCurrentLine.type,
          body: formattedText.slice(lastBraceNodeInCurrentLine.range[0], rangeEndOfLine),
        };
        mutableLine = formattedText.slice(
          rangeStartOfLine + offset,
          lastBraceNodeInCurrentLine.range[0],
        );
      } else {
        braceNodesInCurrentLine.push(lastBraceNodeInCurrentLine);
      }

      if (braceNodesInCurrentLine.length) {
        parts.push({
          type: BraceType.CB,
          body: '}',
        });
        mutableLine = mutableLine.slice(1);
      }

      if (mutableLine) {
        parts.push({
          type: 'Text',
          body: mutableLine,
        });
      }

      if (maybeLastPart) {
        parts.push(maybeLastPart);
      }
    }

    rangeStartOfLine = rangeEndOfLine + EOL.length;

    return {
      indentLevel,
      parts,
    };
  });

  // If 'Text' exists after 'ClosingBrace', add a line break between 'ClosingBrace' and 'Text'.
  for (let index = lineNodes.length - 1; index >= 0; index -= 1) {
    const { indentLevel, parts } = lineNodes[index];
    const firstPart = parts.at(0);

    if (firstPart?.type === BraceType.CB) {
      const secondPart = parts.at(1);

      if (secondPart) {
        lineNodes.splice(
          index,
          1,
          { indentLevel, parts: [firstPart] },
          {
            indentLevel,
            parts: [
              { type: secondPart.type, body: secondPart.body.trimStart() },
              ...parts.slice(2),
            ],
          },
        );
      }
    }
  }

  // @ts-ignore
  if (options.braceStyle === 'allman') {
    // Add a line break before 'OpeningBrace'.
    for (let index = lineNodes.length - 1; index >= 0; index -= 1) {
      const { indentLevel, parts } = lineNodes[index];
      const lastPart = parts.at(-1);

      if (lastPart?.type === BraceType.OB || lastPart?.type === BraceType.OBTO) {
        const secondLastPart = parts.at(-2);

        if (secondLastPart) {
          lineNodes.splice(
            index,
            1,
            {
              indentLevel,
              parts: [
                ...parts.slice(0, -2),
                { type: secondLastPart.type, body: secondLastPart.body.trimEnd() },
              ],
            },
            {
              indentLevel: lastPart?.type === BraceType.OBTO ? indentLevel + 1 : indentLevel,
              parts: [lastPart],
            },
          );
        }
      }
    }
  }

  const assembledText = lineNodes
    .map(
      ({ indentLevel, parts }) =>
        `${indentUnit.repeat(indentLevel)}${parts.map(({ body }) => body).join('')}`,
    )
    .join(EOL);

  return assembledText;
}

function createPrinter(parserName: 'babel' | 'typescript'): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
    const pluginCandidate = plugins.find((plugin) => plugin.parsers?.[parserName]);

    if (!pluginCandidate) {
      throw new Error('A plugin with the given parser does not exist.');
    }

    const node = path.getValue();

    if (node?.comments) {
      node.comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const { originalText } = options;
    const formattedText = format(originalText, {
      ...options,
      plugins: [pluginCandidate],
      endOfLine: 'lf',
    });
    const parser = pluginCandidate.parsers![parserName];
    const ast = parser.parse(formattedText, pluginCandidate.parsers!, options);

    return parseLineByLineAndAssemble(formattedText, ast, options);
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
