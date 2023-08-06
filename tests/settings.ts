import type { Options } from 'prettier';

import braceStylePlugin from '@/index';

export type Fixture = {
  name: string;
  input: string;
  output: string;
};

export { format } from 'prettier';

export const baseOptions: Options = {
  plugins: [braceStylePlugin],
};
