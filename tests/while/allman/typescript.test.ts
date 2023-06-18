import { format, baseOptions } from '../../settings';
import { whileCode, doWhileCode } from '../fixtures';
import { whileCodeResult, doWhileCodeResult } from './expected-results';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

describe('[typescript] allman - while statements', () => {
  test('while', () => {
    expect(format(whileCode, options)).toBe(whileCodeResult);
  });

  test('do...while', () => {
    expect(format(doWhileCode, options)).toBe(doWhileCodeResult);
  });
});
