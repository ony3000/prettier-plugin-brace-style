import { format, baseOptions } from '../../settings';
import { forCode, forInCode, forOfCode, forAwaitOfCode } from '../fixtures';
import {
  forCodeResult,
  forInCodeResult,
  forOfCodeResult,
  forAwaitOfCodeResult,
} from './expected-results';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: '1tbs',
};

describe('[typescript] 1tbs - for statements', () => {
  test('for', () => {
    expect(format(forCode, options)).toBe(forCodeResult);
  });

  test('for...in', () => {
    expect(format(forInCode, options)).toBe(forInCodeResult);
  });

  test('for...of', () => {
    expect(format(forOfCode, options)).toBe(forOfCodeResult);
  });

  test('for await...of', () => {
    expect(format(forAwaitOfCode, options)).toBe(forAwaitOfCodeResult);
  });
});
