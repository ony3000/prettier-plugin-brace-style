import { format, baseOptions } from '../../settings';
import {
  functionDeclarationCode,
  functionExpressionCode,
  arrowFunctionExpressionCode,
  functionCode1,
  functionCode2,
  functionCode3,
  functionCode4,
} from '../fixtures';
import {
  functionDeclarationCodeResult,
  functionExpressionCodeResult,
  arrowFunctionExpressionCodeResult,
  functionCode1Result,
  functionCode2Result,
  functionCode3Result,
  functionCode4Result,
} from './expected-results';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: '1tbs',
};

describe('[babel] 1tbs - function statements', () => {
  test('function declaration', () => {
    expect(format(functionDeclarationCode, options)).toBe(functionDeclarationCodeResult);
  });

  test('function expression', () => {
    expect(format(functionExpressionCode, options)).toBe(functionExpressionCodeResult);
  });

  test('arrow function expression', () => {
    expect(format(arrowFunctionExpressionCode, options)).toBe(arrowFunctionExpressionCodeResult);
  });

  test('function (containing only comments in brackets #1)', () => {
    expect(format(functionCode1, options)).toBe(functionCode1Result);
  });

  test('function (containing only comments in brackets #2)', () => {
    expect(format(functionCode2, options)).toBe(functionCode2Result);
  });

  test('function (containing only comments in brackets #3)', () => {
    expect(format(functionCode3, options)).toBe(functionCode3Result);
  });

  test('function (containing only comments in brackets #4)', () => {
    expect(format(functionCode4, options)).toBe(functionCode4Result);
  });
});
