import { parseLineByLineAndAssemble } from 'core-parts';
import type { Parser, ParserOptions } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) => babelParsers.babel.parse(text, options),
  parseTypescript: (text: string, options: ParserOptions) =>
    typescriptParsers.typescript.parse(text, options),
};

function transformParser(
  parserName: 'babel' | 'typescript' | 'vue',
  defaultParser: Parser,
): Parser {
  return {
    ...defaultParser,
    parse: async (text: string, options: ParserOptions) => {
      const formattedText = await format(text, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
      });
      const ast = defaultParser.parse(formattedText, options);

      const result = parseLineByLineAndAssemble(
        formattedText,
        ast,
        // @ts-ignore
        options,
        addon,
      );

      return {
        type: 'FormattedText',
        body: result,
      };
    },
    astFormat: 'brace-style-ast',
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser('babel', babelParsers.babel),
  typescript: transformParser('typescript', typescriptParsers.typescript),
  vue: transformParser('vue', htmlParsers.vue),
};
