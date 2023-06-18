import { format, baseOptions } from '../../settings';
import {
  functionDeclarationCode,
  functionExpressionCode,
  arrowFunctionExpressionCode,
} from '../fixtures';
import {
  functionDeclarationCodeResult,
  functionExpressionCodeResult,
  arrowFunctionExpressionCodeResult,
} from './expected-results';

const options = {
  ...baseOptions,
  braceStyle: '1tbs',
};

describe('1tbs - function statements', () => {
  test('function declaration', () => {
    expect(format(functionDeclarationCode, options)).toBe(functionDeclarationCodeResult);
  });

  test('function expression', () => {
    expect(format(functionExpressionCode, options)).toBe(functionExpressionCodeResult);
  });

  test('arrow function expression', () => {
    expect(format(arrowFunctionExpressionCode, options)).toBe(arrowFunctionExpressionCodeResult);
  });
});
