import type { Plugin } from 'prettier';

import { languages } from './languages';
import { parsers } from './parsers';
import { options } from './options';

const braceStylePlugin: Plugin = {
  languages,
  parsers,
  options,
};

export { braceStylePlugin };
