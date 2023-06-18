import { format, baseOptions } from '../../settings';
import { whileCode, doWhileCode } from '../fixtures';
import { whileCodeResult, doWhileCodeResult } from './expected-results';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: '1tbs',
};

describe('[typescript] 1tbs - while statements', () => {
  test('while', () => {
    expect(format(whileCode, options)).toBe(whileCodeResult);
  });

  test('do...while', () => {
    expect(format(doWhileCode, options)).toBe(doWhileCodeResult);
  });
});
