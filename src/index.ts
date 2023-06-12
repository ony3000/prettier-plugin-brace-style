import type { Plugin } from 'prettier';

import { languages } from './languages';
import { options } from './options';

const braceStylePlugin: Plugin = {
  languages,
  options,
};

export { braceStylePlugin };
