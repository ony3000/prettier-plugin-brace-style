import { format, baseOptions } from '../../settings';
import { ifCode, ifElseCode, ifElseifElseCode, ifElseCodeWithComment } from '../fixtures';

const options = {
  ...baseOptions,
  braceStyle: 'stroustrup',
};

describe('stroustrup - if statements', () => {
  test('if', () => {
    const expectedResult = `if (foo) {
  bar();
}
`;

    expect(format(ifCode, options)).toBe(expectedResult);
  });

  test('if...else', () => {
    const expectedResult = `if (foo) {
  bar();
}
else {
  baz();
}
`;

    expect(format(ifElseCode, options)).toBe(expectedResult);
  });

  test('if...elseif...else', () => {
    const expectedResult = `if (foo) {
  bar();
}
else if (baz) {
  qux();
}
else {
  quux();
}
`;

    expect(format(ifElseifElseCode, options)).toBe(expectedResult);
  });

  test('if...else (with comment)', () => {
    const expectedResult = `// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
`;

    expect(format(ifElseCodeWithComment, options)).toBe(expectedResult);
  });
});
