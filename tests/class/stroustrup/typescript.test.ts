import { format, baseOptions } from '../../settings';
import {
  emptyClassDeclarationCode,
  classDeclarationCode,
  classExpressionCode,
  classDeclarationCodeWithGetterSetter,
  classDeclarationCodeWithStatic,
} from '../fixtures';
import {
  emptyClassDeclarationCodeResult,
  classDeclarationCodeResult,
  classExpressionCodeResult,
  classDeclarationCodeWithGetterSetterResult,
  classDeclarationCodeWithStaticResult,
} from './expected-results';

const options = {
  ...baseOptions,
  braceStyle: 'stroustrup',
};

describe('stroustrup - class statements', () => {
  test('class declaration (empty body)', () => {
    expect(format(emptyClassDeclarationCode, options)).toBe(emptyClassDeclarationCodeResult);
  });

  test('class declaration', () => {
    expect(format(classDeclarationCode, options)).toBe(classDeclarationCodeResult);
  });

  test('class expression', () => {
    expect(format(classExpressionCode, options)).toBe(classExpressionCodeResult);
  });

  test('class declaration (with getter/setter)', () => {
    expect(format(classDeclarationCodeWithGetterSetter, options)).toBe(
      classDeclarationCodeWithGetterSetterResult,
    );
  });

  test('class declaration (with static things)', () => {
    expect(format(classDeclarationCodeWithStatic, options)).toBe(
      classDeclarationCodeWithStaticResult,
    );
  });
});
