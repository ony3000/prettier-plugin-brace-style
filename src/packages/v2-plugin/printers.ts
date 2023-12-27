import { parseLineByLineAndAssemble } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Parser } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

function createPrinter(parserName: 'babel' | 'typescript', defaultParser: Parser): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const comments = path.getValue()?.comments;

    if (comments && Array.isArray(comments)) {
      comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const { originalText } = options;
    const formattedText = format(originalText, {
      ...options,
      plugins: [],
      endOfLine: 'lf',
    });
    const ast = defaultParser.parse(formattedText, { [parserName]: defaultParser }, options);

    return parseLineByLineAndAssemble(
      formattedText,
      ast,
      // @ts-ignore
      options,
    );
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel', babelParsers.babel),
  'typescript-ast': createPrinter('typescript', typescriptParsers.typescript),
};
