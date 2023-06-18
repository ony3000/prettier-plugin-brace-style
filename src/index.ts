import type { Plugin } from 'prettier';

import { parsers } from './parsers';
import { printers } from './printers';
import { options } from './options';

const braceStylePlugin: Plugin = {
  parsers,
  printers,
  options,
};

export default braceStylePlugin;
