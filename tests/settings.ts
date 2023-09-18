import type { Options as v2Options } from 'prettier';
import { format as v2Format } from 'prettier';
import type { Options as v3Options } from 'prettier3';
import { format as v3Format } from 'prettier3';

import v2Plugin from '@/v2-plugin';
import v3Plugin from '@/v3-plugin';

export type Fixture = {
  name: string;
  input: string;
  output: string;
};

export const format = process.env.PRETTIER_VERSION === '2' ? v2Format : v3Format;

const baseOptionsWithoutPlugins = {
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
} as const;

export const baseOptions =
  process.env.PRETTIER_VERSION === '2'
    ? ({
        plugins: [v2Plugin],
        ...baseOptionsWithoutPlugins,
      } as v2Options)
    : ({
        plugins: [v3Plugin],
        ...baseOptionsWithoutPlugins,
      } as v3Options);
