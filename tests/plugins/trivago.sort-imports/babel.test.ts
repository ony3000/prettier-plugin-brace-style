import braceStylePlugin from '@/index';
import { format, sortImportsPlugin } from '../../settings';
import { reactComponentCode } from '../fixtures';
import { reactComponentCodeResult } from './expected-results';

const options = {
  parser: 'babel',
  plugins: [sortImportsPlugin, braceStylePlugin],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@[^/]+/(.*)$', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  braceStyle: 'allman',
};

describe('[babel] combination with @trivago/prettier-plugin-sort-imports', () => {
  test('react component', () => {
    expect(format(reactComponentCode, options)).toBe(reactComponentCodeResult);
  });
});