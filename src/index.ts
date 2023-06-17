import type { Plugin } from 'prettier';

import { languages } from './languages';
import { parsers } from './parsers';
import { printers } from './printers';
import { options } from './options';

const braceStylePlugin: Plugin = {
  languages,
  parsers,
  printers,
  options,
};

export default braceStylePlugin;
