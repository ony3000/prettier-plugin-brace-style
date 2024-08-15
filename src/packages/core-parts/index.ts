import {
  findTargetBraceNodes,
  findTargetBraceNodesForVue,
  findTargetBraceNodesForAngular,
  findTargetBraceNodesForAstro,
  findTargetBraceNodesForSvelte,
} from './finder';
import type { Dict, BraceNode } from './shared';
import { BraceType } from './shared';

const EOL = '\n';

type LinePart = {
  type: string;
  body: string;
};

type LineNode = {
  indentLevel: number;
  parts: LinePart[];
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

    const offset = indentUnit.length * indentLevel;

    let temporaryRangeEnd = rangeEndOfLine;

    for (let index = braceNodesInCurrentLine.length - 1; index >= 0; index -= 1) {
      const braceNode = braceNodesInCurrentLine[index];
      const [rangeStartOfBrace, rangeEndOfBrace] = braceNode.range;

      parts.push({
        type: 'Text',
        body: formattedText.slice(rangeEndOfBrace, temporaryRangeEnd),
      });
      parts.push({
        type: braceNode.type,
        body: formattedText.slice(rangeStartOfBrace, rangeEndOfBrace),
      });
      temporaryRangeEnd = rangeStartOfBrace;
    }
    parts.push({
      type: 'Text',
      body: formattedText.slice(rangeStartOfLine, temporaryRangeEnd).slice(offset),
    });
    parts.reverse();

    if (parts.length > 1 && parts[0].body === '') {
      parts.shift();
    }
    if (parts.length > 1 && parts[parts.length - 1].body === '') {
      parts.pop();
    }

    rangeStartOfLine = rangeEndOfLine + EOL.length;

    return {
      indentLevel,
      parts,
    };
  });
}

/**
 * Add a line break after `ClosingBrace`.
 */
function splitLineContainingClosingBrace(lineNodes: LineNode[]) {
  for (let lineIndex = lineNodes.length - 1; lineIndex >= 0; lineIndex -= 1) {
    const { indentLevel, parts } = lineNodes[lineIndex];
    const temporaryLineNodes: LineNode[] = [];

    let temporaryPartIndex = 0;

    for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
      const currentPart = parts[partIndex];

      if (currentPart.type === BraceType.CB) {
        temporaryLineNodes.push({
          indentLevel,
          parts: parts.slice(temporaryPartIndex, partIndex + 1),
        });
        temporaryPartIndex = partIndex + 1;

        const rightPart = parts.at(partIndex + 1);

        if (rightPart) {
          rightPart.body = rightPart.body.trimStart();
        }
      }
    }
    temporaryLineNodes.push({
      indentLevel,
      parts: parts.slice(temporaryPartIndex),
    });

    lineNodes.splice(
      lineIndex,
      1,
      ...temporaryLineNodes.filter((lineNode) => lineNode.parts.length),
    );
  }
}

/**
 * Add a line break before `OpeningBrace`.
 */
function splitLineContainingOpeningBrace(lineNodes: LineNode[]) {
  for (let lineIndex = lineNodes.length - 1; lineIndex >= 0; lineIndex -= 1) {
    const { indentLevel, parts } = lineNodes[lineIndex];
    const temporaryLineNodes: LineNode[] = [];

    let temporaryPartIndex = parts.length;

    for (let partIndex = parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const currentPart = parts[partIndex];

      if (currentPart.type === BraceType.OB || currentPart.type === BraceType.OBTO) {
        temporaryLineNodes.push({
          indentLevel: currentPart.type === BraceType.OBTO ? indentLevel + 1 : indentLevel,
          parts: parts.slice(partIndex, temporaryPartIndex),
        });
        temporaryPartIndex = partIndex;

        const leftPart = parts.at(partIndex - 1);

        if (leftPart) {
          leftPart.body = leftPart.body.trimEnd();
        }
      }
    }
    temporaryLineNodes.push({
      indentLevel,
      parts: parts.slice(0, temporaryPartIndex),
    });
    temporaryLineNodes.reverse();

    lineNodes.splice(
      lineIndex,
      1,
      ...temporaryLineNodes.filter((lineNode) => lineNode.parts.length),
    );
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
  options: ResolvedOptions,
  addon: Dict<(text: string, options: any) => any>,
): string {
  if (formattedText === '' || options.braceStyle === '1tbs' || options.parser === 'html') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetBraceNodes: BraceNode[];
  switch (options.parser) {
    case 'astro': {
      targetBraceNodes = findTargetBraceNodesForAstro(ast, options, addon);
      break;
    }
    case 'svelte': {
      targetBraceNodes = findTargetBraceNodesForSvelte(ast);
      break;
    }
    case 'angular': {
      targetBraceNodes = findTargetBraceNodesForAngular(ast, options, addon);
      break;
    }
    case 'vue': {
      targetBraceNodes = findTargetBraceNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetBraceNodes = findTargetBraceNodes(ast);
      break;
    }
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit, targetBraceNodes);

  splitLineContainingClosingBrace(lineNodes);

  if (options.braceStyle === 'allman') {
    splitLineContainingOpeningBrace(lineNodes);
  }

  return assembleLine(lineNodes, indentUnit);
}
