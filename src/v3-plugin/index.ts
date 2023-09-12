import type { Plugin } from 'prettier3';

import { options } from './options';
import { parsers } from './parsers';
import { printers } from './printers';

export const braceStylePlugin: Plugin = {
  parsers,
  printers,
  options,
};
