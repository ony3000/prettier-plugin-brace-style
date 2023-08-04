import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';

type LinePart = {
  type: string;
  body: string;
};

type LineInfo = {
  indentLevel: number;
  parts: LinePart[];
};

export function parseLineByLineAndAssemble(
  formattedText: string,
  braceStyle: '1tbs' | 'stroustrup' | 'allman',
  unitIndentText: string,
): string {
  const endOfLineMatchResult = formattedText.match(/([\r\n]+)$/);

  if (!endOfLineMatchResult) {
    throw new Error('There are no line breaks in the text.');
  }

  const EOL = endOfLineMatchResult[1];

  const lineInfos: LineInfo[] = formattedText.split(EOL).map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${unitIndentText})*`));
    const indentLevel = indentMatchResult![0].length / unitIndentText.length;
    const parts: LinePart[] = [];

    const trimmedLine = line.trimStart();
    const braceMatchResult = trimmedLine.match(/^(}?)([^{}]*)({?)$/);

    if (braceMatchResult) {
      if (braceMatchResult[1] === '}') {
        parts.push({
          type: 'ClosingBrace',
          body: braceMatchResult[1],
        });
      }

      if (braceMatchResult[2] !== '') {
        parts.push({
          type: 'Text',
          body: braceMatchResult[2],
        });
      }

      if (braceMatchResult[3] === '{') {
        parts.push({
          type: 'OpeningBrace',
          body: braceMatchResult[3],
        });
      }
    }

    return {
      indentLevel,
      parts,
    };
  });

  if (braceStyle === 'stroustrup' || braceStyle === 'allman') {
    // If 'Text' exists after 'ClosingBrace', add a line break between 'ClosingBrace' and 'Text'.

    for (let index = lineInfos.length - 1; index >= 0; index -= 1) {
      const { indentLevel, parts } = lineInfos[index];
      const firstPart = parts.at(0);

      if (firstPart?.type === 'ClosingBrace') {
        const secondPart = parts.at(1);

        if (secondPart) {
          lineInfos.splice(
            index,
            1,
            { indentLevel, parts: parts.slice(0, 1) },
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

  if (braceStyle === 'allman') {
    // Add a line break before 'OpeningBrace'.

    for (let index = lineInfos.length - 1; index >= 0; index -= 1) {
      const { indentLevel, parts } = lineInfos[index];
      const lastPart = parts.at(-1);

      if (lastPart?.type === 'OpeningBrace') {
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
            { indentLevel, parts: parts.slice(-1) },
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
    const formattedText = format(originalText, {
      ...options,
      plugins: [pluginCandidate],
      rangeEnd: Infinity,
    });

    if (formattedText !== '' && braceStyle !== '1tbs') {
      return parseLineByLineAndAssemble(
        formattedText,
        braceStyle,
        useTabs ? '\t' : ' '.repeat(tabWidth),
      );
    }

    return formattedText;
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
