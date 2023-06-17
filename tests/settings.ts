import type { Options } from 'prettier';

import braceStylePlugin from '@/index';

export { format } from 'prettier';

export const baseOptions: Options = {
  parser: 'typescript',
  plugins: [braceStylePlugin],
};
