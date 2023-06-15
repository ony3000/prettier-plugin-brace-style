import type { AstPath, ParserOptions, Doc, Plugin, Printer } from 'prettier';

let defaultPrinter: Printer;

function typescriptPrint(
  path: AstPath,
  options: ParserOptions,
  print: (path: AstPath) => Doc,
): Doc {
  const node = path.getValue();

  if (node && node.type === 'Program') {
    const pluginOrNot = (
      options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[]
    ).find((plugin) => plugin.printers?.estree);

    if (pluginOrNot) {
      defaultPrinter = pluginOrNot.printers!.estree;
    }
  }

  const defaultDoc = defaultPrinter.print(path, options, print);

  return defaultDoc;
}

export const printers: { [astFormat: string]: Printer } = {
  'typescript-ast': {
    print: typescriptPrint,
  },
};
