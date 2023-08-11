import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';

enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

type BraceInfo = {
  type: BraceType;
  range: [number, number];
};

type LinePart = {
  type: string;
  body: string;
};

type LineInfo = {
  indentLevel: number;
  parts: LinePart[];
};

const IS_DEBUGGING_MODE = false;

function findTargetBrace(ast: any): BraceInfo[] {
  const braceEnclosingRanges: [number, number][] = [];
  const braceTypePerIndex: Record<string, BraceType> = {};

  function treatNextNodeAsPlainText(commentRange: [number, number]): void {
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

  function recursion(node: unknown, parentNode?: unknown): void {
    if (typeof node !== 'object' || node === null || !('type' in node)) {
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

    if (!('range' in node) || !Array.isArray(node.range)) {
      return;
    }

    const [rangeStart, rangeEnd] = node.range as [number, number];

    if (IS_DEBUGGING_MODE) {
      if (node.type !== 'Punctuator') {
        console.dir(node);
      }
    }

    switch (node.type) {
      case 'TSEnumDeclaration': {
        if ('id' in node && typeof node.id === 'object' && node.id !== null && 'name' in node.id) {
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
        if (typeof parentNode === 'object' && parentNode !== null && 'type' in parentNode) {
          if (parentNode.type === 'SwitchCase') {
            braceTypePerIndex[rangeStart] = BraceType.OBNT;
          } else if (parentNode.type === 'DoWhileStatement') {
            braceTypePerIndex[rangeEnd - 1] = BraceType.CBNT;
          }
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
        if (
          'discriminant' in node &&
          typeof node.discriminant === 'object' &&
          node.discriminant !== null &&
          'name' in node.discriminant
        ) {
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
          node.value.match(/prettier-ignore/)
        ) {
          treatNextNodeAsPlainText([rangeStart, rangeEnd]);
        }
        break;
      }
      case 'File': {
        if ('comments' in node && Array.isArray(node.comments)) {
          node.comments.forEach((comment: unknown) => {
            if (
              typeof comment === 'object' &&
              comment !== null &&
              'start' in comment &&
              typeof comment.start === 'number' &&
              'end' in comment &&
              typeof comment.end === 'number' &&
              'value' in comment &&
              typeof comment.value === 'string' &&
              comment.value.match(/prettier-ignore/)
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

  if (IS_DEBUGGING_MODE) {
    console.log(braceTypePerIndex);
  }

  return Object.entries(braceTypePerIndex)
    .map<BraceInfo>(([key, value]) => {
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
  braceStyle: '1tbs' | 'stroustrup' | 'allman',
  unitIndentText: string,
  ast: any,
): string {
  if (formattedText === '' || braceStyle === '1tbs') {
    return formattedText;
  }

  const endOfLineMatchResult = formattedText.match(/([\r\n]+)$/);

  if (!endOfLineMatchResult) {
    throw new Error('There are no line breaks in the text.');
  }

  const EOL = endOfLineMatchResult[1];

  const braceInfos = findTargetBrace(ast);
  if (IS_DEBUGGING_MODE) {
    console.dir(JSON.stringify(formattedText));
    console.dir(braceInfos);
  }
  const formattedLines = formattedText.split(EOL);
  let rangeStartOfLine = 0;
  let rangeEndOfLine: number;

  const lineInfos: LineInfo[] = formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${unitIndentText})*`));
    const indentLevel = indentMatchResult![0].length / unitIndentText.length;

    rangeEndOfLine = rangeStartOfLine + line.length;

    const braceInfosInCurrentLine = braceInfos.filter(
      ({ range: [rangeStartOfBrace, rangeEndOfBrace] }) =>
        rangeStartOfLine <= rangeStartOfBrace && rangeEndOfBrace <= rangeEndOfLine,
    );
    const parts: LinePart[] = [];
    let maybeLastPart: LinePart | null = null;

    const trimmedLine = line.trimStart(); // base of 'mutableLine'
    let mutableLine = trimmedLine;

    if (IS_DEBUGGING_MODE) {
      console.dir(
        [`rangeOfCurrentLine: [${rangeStartOfLine}, ${rangeEndOfLine}]`, braceInfosInCurrentLine],
        { depth: null },
      );
    }

    if (braceInfosInCurrentLine.length === 0) {
      parts.push({
        type: 'Text',
        body: mutableLine,
      });
    } else {
      const lastBraceInCurrentLine = braceInfosInCurrentLine.pop()!;

      if (
        lastBraceInCurrentLine.type === BraceType.OB ||
        lastBraceInCurrentLine.type === BraceType.OBTO
      ) {
        maybeLastPart = {
          type: lastBraceInCurrentLine.type,
          body: formattedText.slice(lastBraceInCurrentLine.range[0], rangeEndOfLine),
        };
        mutableLine = formattedText
          .slice(rangeStartOfLine, lastBraceInCurrentLine.range[0])
          .trimStart();
      } else {
        braceInfosInCurrentLine.push(lastBraceInCurrentLine);
      }

      if (braceInfosInCurrentLine.length) {
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

  if (IS_DEBUGGING_MODE) {
    console.dir(lineInfos, { depth: null });
  }

  // If 'Text' exists after 'ClosingBrace', add a line break between 'ClosingBrace' and 'Text'.
  for (let index = lineInfos.length - 1; index >= 0; index -= 1) {
    const { indentLevel, parts } = lineInfos[index];
    const firstPart = parts.at(0);

    if (firstPart?.type === BraceType.CB) {
      const secondPart = parts.at(1);

      if (secondPart) {
        lineInfos.splice(
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

  if (braceStyle === 'allman') {
    // Add a line break before 'OpeningBrace'.
    for (let index = lineInfos.length - 1; index >= 0; index -= 1) {
      const { indentLevel, parts } = lineInfos[index];
      const lastPart = parts.at(-1);

      if (lastPart?.type === BraceType.OB || lastPart?.type === BraceType.OBTO) {
        const secondLastPart = parts.at(-2);

        if (secondLastPart) {
          lineInfos.splice(
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
              indentLevel: lastPart?.type === BraceType.OB ? indentLevel : indentLevel + 1,
              parts: [lastPart],
            },
          );
        }
      }
    }
  }

  const assembledText = lineInfos
    .map(
      ({ indentLevel, parts }) =>
        `${unitIndentText.repeat(indentLevel)}${parts.map(({ body }) => body).join('')}`,
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

    // @ts-ignore
    const { braceStyle, originalText, tabWidth, useTabs } = options;
    const unitIndentText = useTabs ? '\t' : ' '.repeat(tabWidth);
    const formattedText = format(originalText, {
      ...options,
      plugins: [pluginCandidate],
    });

    const parser = pluginCandidate.parsers![parserName];
    const ast = parser.parse(formattedText, pluginCandidate.parsers!, options);

    return parseLineByLineAndAssemble(formattedText, braceStyle, unitIndentText, ast);
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
