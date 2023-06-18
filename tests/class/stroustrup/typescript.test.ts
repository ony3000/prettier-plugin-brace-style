import { format, baseOptions } from '../../settings';
import {
  emptyClassDeclarationCode,
  classDeclarationCode,
  classExpressionCode,
  classDeclarationCodeWithGetterSetter,
  classDeclarationCodeWithStatic,
} from '../fixtures';

const options = {
  ...baseOptions,
  braceStyle: 'stroustrup',
};

describe('stroustrup - class statements', () => {
  test('class declaration (empty body)', () => {
    const expectedResult = `class Foo {}
`;

    expect(format(emptyClassDeclarationCode, options)).toBe(expectedResult);
  });

  test('class declaration', () => {
    const expectedResult = `class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
`;

    expect(format(classDeclarationCode, options)).toBe(expectedResult);
  });

  test('class expression', () => {
    const expectedResult = `const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
`;

    expect(format(classExpressionCode, options)).toBe(expectedResult);
  });

  test('class declaration (with getter/setter)', () => {
    const expectedResult = `class User {
  constructor(name) {
    // invokes the setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }
}
`;

    expect(format(classDeclarationCodeWithGetterSetter, options)).toBe(expectedResult);
  });

  test('class declaration (with static things)', () => {
    const expectedResult = `class ClassWithStaticMethod {
  static staticProperty = "someValue";
  static staticMethod() {
    return "static method has been called.";
  }
  static {
    console.log("Class static initialization block called");
  }
}
`;

    expect(format(classDeclarationCodeWithStatic, options)).toBe(expectedResult);
  });
});
