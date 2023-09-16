import type { Plugin } from 'prettier3';

import { options } from './v3-parts/options';
import { parsers } from './v3-parts/parsers';
import { printers } from './v3-parts/printers';

export const braceStylePlugin: Plugin = {
  parsers,
  printers,
  options,
};
