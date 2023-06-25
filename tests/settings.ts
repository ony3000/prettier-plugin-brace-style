import type { Options } from 'prettier';
import {
  parsers as tailwindcssParsers,
  printers as tailwindcssPrinters,
  options as tailwindcssOptions,
  // @ts-ignore
} from 'prettier-plugin-tailwindcss';

import braceStylePlugin from '@/index';

export { format } from 'prettier';

export const baseOptions: Options = {
  plugins: [braceStylePlugin],
};

export const tailwindcssPlugin = {
  parsers: tailwindcssParsers,
  printers: tailwindcssPrinters,
  options: tailwindcssOptions,
};
