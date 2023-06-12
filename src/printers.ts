import type { AstPath, ParserOptions, Doc, Plugin, Printer } from 'prettier';

let defaultPrint: (path: AstPath, options: ParserOptions, print: (path: AstPath) => Doc) => Doc;

function typescriptPrint(
  path: AstPath,
  options: ParserOptions,
  print: (path: AstPath) => Doc,
): Doc {
  if (!defaultPrint) {
    const pluginOrNot = (
      options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[]
    ).find((plugin) => plugin.printers?.estree);

    if (pluginOrNot) {
      defaultPrint = pluginOrNot.printers!.estree.print;
    }
  }

  const defaultDoc = defaultPrint(path, options, print);

  return defaultDoc;
}

export const printers: { [astFormat: string]: Printer } = {
  'typescript-ast': {
    print: typescriptPrint,
  },
};
