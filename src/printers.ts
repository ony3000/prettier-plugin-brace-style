import type { AstPath, ParserOptions, Doc, Printer } from 'prettier';

import { extractPrinter } from './utils';

let defaultPrinter: Printer | undefined;

function typescriptPrint(
  path: AstPath,
  options: ParserOptions,
  print: (path: AstPath) => Doc,
): Doc {
  const node = path.getValue();

  if (node && node.type === 'Program') {
    defaultPrinter = extractPrinter(options);
  }

  if (!defaultPrinter) {
    throw new Error(`Unexpected path: ${JSON.stringify(path)}`);
  }

  const defaultDoc = defaultPrinter.print(path, options, print);

  return defaultDoc;
}

export const printers: { [astFormat: string]: Printer } = {
  'typescript-ast': {
    print: typescriptPrint,
  },
};
