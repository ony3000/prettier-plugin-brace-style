import type { ParserOptions, Printer, Plugin } from 'prettier';

export function extractPrinter(options: ParserOptions): Printer | undefined {
  const pluginOrNot = (
    options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[]
  ).find((plugin) => plugin.printers?.estree);

  if (pluginOrNot) {
    return pluginOrNot.printers!.estree;
  }

  return undefined;
}
