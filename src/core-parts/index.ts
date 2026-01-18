import type { AST } from 'prettier';
import { z } from 'zod';

import {
  findTargetBraceNodesForBabel,
  findTargetBraceNodesForTypeScript,
  findTargetBraceNodesForHtml,
  findTargetBraceNodesForVue,
  findTargetBraceNodesForAstro,
  findTargetBraceNodesForSvelte,
  findTargetBraceNodesForOxc,
  findTargetBraceNodesForOxcTypeScript,
} from './finder';
import { type BraceNode, BraceType, EOL, isTypeof } from './utils';

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
    // biome-ignore lint/style/noNonNullAssertion: The '0 or more' match quantifier returns a result array even if no matches are found.
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

function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
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
  ast: AST,
  options: ResolvedOptions,
): string {
  if (formattedText === '' || options.braceStyle === '1tbs') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetBraceNodes: BraceNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetBraceNodes = findTargetBraceNodesForAstro(ast, options);
      break;
    }
    case 'svelte': {
      targetBraceNodes = findTargetBraceNodesForSvelte(ast, options);
      break;
    }
    case 'babel':
    case 'babel-ts': {
      targetBraceNodes = findTargetBraceNodesForBabel(ast, options);
      break;
    }
    case 'typescript': {
      targetBraceNodes = findTargetBraceNodesForTypeScript(ast, options);
      break;
    }
    case 'angular':
    case 'html': {
      targetBraceNodes = findTargetBraceNodesForHtml(ast, options);
      break;
    }
    case 'vue': {
      targetBraceNodes = findTargetBraceNodesForVue(ast, options);
      break;
    }
    case 'oxc': {
      targetBraceNodes = findTargetBraceNodesForOxc(ast, options, formattedText);
      break;
    }
    case 'oxc-ts': {
      targetBraceNodes = findTargetBraceNodesForOxcTypeScript(ast, options, formattedText);
      break;
    }
    default: {
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

export function refineSvelteAst(preprocessedText: string, ast: AST) {
  if (!ast.instance) {
    return ast;
  }

  const scriptTag = preprocessedText.slice(ast.instance.start, ast.instance.end);
  const matchResult = scriptTag.match(/ ✂prettier:content✂="([^"]+)"/);

  if (matchResult === null) {
    return ast;
  }

  const [temporaryAttributeWithLeadingSpace, encodedContent] = matchResult;
  const plainContent = base64Decode(encodedContent);

  const restoreOffset =
    plainContent.length - (temporaryAttributeWithLeadingSpace.length + '{}'.length);

  function recursion(node: unknown): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode);
        });
        return;
      }

      recursion(value);
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

    if (ast.instance.end <= node.start) {
      node.start += restoreOffset;
    }
    if (ast.instance.end <= node.end) {
      node.end += restoreOffset;
    }
  }

  recursion(ast.html);

  ast.instance = {
    type: 'RefinedScript',
    start: ast.instance.start,
    end: ast.instance.end + restoreOffset,
    loc: {
      start: {
        line: preprocessedText.slice(0, ast.instance.start).split(EOL).length,
      },
    },
    content: {
      type: 'RefinedScriptSource',
      start: ast.instance.end + restoreOffset - ('</script>'.length + plainContent.length),
      end: ast.instance.end + restoreOffset - '</script>'.length,
      loc: {
        start: {
          line: ast.instance.content.body[0].loc.start.line,
        },
      },
      value: plainContent,
    },
  };

  return ast;
}
