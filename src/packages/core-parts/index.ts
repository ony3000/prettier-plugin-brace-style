import { findTargetBraceNodes, findTargetBraceNodesForVue } from './finder';

const EOL = '\n';

enum BraceType {
  OB = 'OpeningBrace',
  OBTO = 'OpeningBraceInTernaryOperator',
  OBNT = 'OpeningBraceButNotTheTarget',
  CB = 'ClosingBrace',
  CBNT = 'ClosingBraceButNotTheTarget',
}

type Dict<T = unknown> = Record<string, T | undefined>;

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

type NarrowedParserOptions = {
  tabWidth: number;
  useTabs: boolean;
  parser: string;
  braceStyle: '1tbs' | 'stroustrup' | 'allman';
};

function parseLineByLine(
  formattedText: string,
  indentUnit: string,
  targetBraceNodes: BraceNode[],
): LineNode[] {
  const formattedLines = formattedText.split(EOL);
  let rangeStartOfLine = 0;
  let rangeEndOfLine: number;

  return formattedLines.map((line) => {
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
}

/**
 * If `Text` exists after `ClosingBrace`, add a line break between `ClosingBrace` and `Text`.
 */
function splitLineStartingWithClosingBrace(lineNodes: LineNode[]) {
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
}

/**
 * If `Text` exists before `OpeningBrace`, add a line break between `OpeningBrace` and `Text`.
 */
function splitLineEndingWithOpeningBrace(lineNodes: LineNode[]) {
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

function assembleLine(lineNodes: LineNode[], indentUnit: string): string {
  return lineNodes
    .map(
      ({ indentLevel, parts }) =>
        `${indentUnit.repeat(indentLevel)}${parts.map(({ body }) => body).join('')}`,
    )
    .join(EOL);
}

export function parseLineByLineAndAssemble(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  addon: Dict<(text: string, options: any) => any>,
): string {
  if (formattedText === '' || options.braceStyle === '1tbs') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetBraceNodes: BraceNode[];
  if (options.parser === 'vue') {
    targetBraceNodes = findTargetBraceNodesForVue(ast, options, addon);
  } else {
    targetBraceNodes = findTargetBraceNodes(ast);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit, targetBraceNodes);

  splitLineStartingWithClosingBrace(lineNodes);

  if (options.braceStyle === 'allman') {
    splitLineEndingWithOpeningBrace(lineNodes);
  }

  return assembleLine(lineNodes, indentUnit);
}
