import { ESLint } from 'eslint';
import type { Options } from 'prettier';
// @ts-ignore
import * as braceStylePlugin from 'prettier-plugin-brace-style';

export type Fixture = {
  name: string;
  input: string;
  output: string;
};

export { format } from 'prettier';

export const baseOptions: Options = {
  plugins: [braceStylePlugin],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
};

export const oneTBSLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', '1tbs'],
    },
  },
});

export const allmanLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', 'allman'],
    },
  },
});

export const stroustrupLinter = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    rules: {
      'brace-style': ['error', 'stroustrup'],
    },
  },
});
