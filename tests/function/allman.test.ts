import { format, baseOptions } from '../settings';
import {
  functionDeclarationCode,
  functionExpressionCode,
  arrowFunctionExpressionCode,
} from './fixtures';

const options = {
  ...baseOptions,
  braceStyle: 'allman',
};

describe('allman - function statements', () => {
  test('function declaration', () => {
    const expectedResult = `function sum(a, b)
{
  return a + b;
}
`;

    expect(format(functionDeclarationCode, options)).toBe(expectedResult);
  });

  test('function expression', () => {
    const expectedResult = `const sum = function (a, b)
{
  return a + b;
};
`;

    expect(format(functionExpressionCode, options)).toBe(expectedResult);
  });

  test('arrow function expression', () => {
    const expectedResult = `const sum = (a, b) =>
{
  return a + b;
};
`;

    expect(format(arrowFunctionExpressionCode, options)).toBe(expectedResult);
  });
});
