import type { Plugin } from 'prettier';

import { options } from './options';

const braceStylePlugin: Plugin = {
  options,
};

export { braceStylePlugin };
