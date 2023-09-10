import type { Plugin } from 'prettier';

import { options } from './options';
import { parsers } from './parsers';
import { printers } from './printers';

const braceStylePlugin: Plugin = {
  parsers,
  printers,
  options,
};

export default braceStylePlugin;
