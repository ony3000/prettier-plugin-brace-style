import { format as formatSync } from '@prettier/sync';
import { parseLineByLineAndAssemble } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Options, Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

function createPrinter(parserName: 'babel' | 'typescript' | 'vue', defaultParser: Parser): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    // @ts-ignore
    const comments = options[Symbol.for('comments')];

    if (comments && Array.isArray(comments)) {
      comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const cloneableOptions: Options = {
      ...Object.fromEntries(
        (
          [
            'printWidth',
            'tabWidth',
            'useTabs',
            'semi',
            'singleQuote',
            'jsxSingleQuote',
            'trailingComma',
            'bracketSpacing',
            'bracketSameLine',
            'jsxBracketSameLine',
            'rangeStart',
            'rangeEnd',
            'parser',
            'requirePragma',
            'insertPragma',
            'proseWrap',
            'arrowParens',
            'htmlWhitespaceSensitivity',
            'endOfLine',
            'quoteProps',
            'vueIndentScriptAndStyle',
            'embeddedLanguageFormatting',
            'singleAttributePerLine',
          ] as const
        ).map((key) => [key, options[key]]),
      ),
      // @ts-ignore
      braceStyle: options.braceStyle,
    };

    const { originalText } = options;
    const formattedText = formatSync(originalText, {
      ...cloneableOptions,
      plugins: [],
      endOfLine: 'lf',
    });
    const ast = defaultParser.parse(formattedText, options);

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
  'vue-ast': createPrinter('babel', htmlParsers.vue),
};
