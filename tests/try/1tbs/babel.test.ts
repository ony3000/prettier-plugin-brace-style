import { format, baseOptions } from '../../settings';
import { tryCatchCode, tryFinallyCode, tryCatchFinallyCode, nestedTryCode } from '../fixtures';
import {
  tryCatchCodeResult,
  tryFinallyCodeResult,
  tryCatchFinallyCodeResult,
  nestedTryCodeResult,
} from './expected-results';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: '1tbs',
};

describe('[babel] 1tbs - try statements', () => {
  test('try...catch', () => {
    expect(format(tryCatchCode, options)).toBe(tryCatchCodeResult);
  });

  test('try...finally', () => {
    expect(format(tryFinallyCode, options)).toBe(tryFinallyCodeResult);
  });

  test('try...catch...finally', () => {
    expect(format(tryCatchFinallyCode, options)).toBe(tryCatchFinallyCodeResult);
  });

  test('nested try', () => {
    expect(format(nestedTryCode, options)).toBe(nestedTryCodeResult);
  });
});