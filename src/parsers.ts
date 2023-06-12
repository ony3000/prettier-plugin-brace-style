import type { Parser } from 'prettier';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

export const parsers: { [parserName: string]: Parser } = {
  typescript: {
    ...typescriptParsers.typescript,
    astFormat: 'typescript-ast',
  },
};
