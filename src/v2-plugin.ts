import type { Plugin } from 'prettier';

import { options } from './v2-parts/options';
import { parsers } from './v2-parts/parsers';
import { printers } from './v2-parts/printers';

const braceStylePlugin: Plugin = {
  parsers,
  printers,
  options,
};

export default braceStylePlugin;
