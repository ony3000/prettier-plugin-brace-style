import braceStylePlugin from '@/index';
import { format, tailwindcssPlugin } from '../../settings';
import { reactComponentCode } from '../fixtures';
import { reactComponentCodeResult } from './expected-results';

const options = {
  parser: 'typescript',
  plugins: [tailwindcssPlugin, braceStylePlugin],
  braceStyle: 'allman',
};

describe('[typescript] combination with prettier-plugin-tailwindcss', () => {
  test('react component', () => {
    expect(format(reactComponentCode, options)).toBe(reactComponentCodeResult);
  });
});
