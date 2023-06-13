import { format, baseOptions } from './settings';
import { exampleCode } from './fixtures';

const expectedResult = `function foo() {
  return true;
}

if (foo) {
  bar();
}

try {
  somethingRisky();
}
catch (e) {
  handleError();
}

if (foo) {
  bar();
}
else {
  baz();
}

class C {
  static {
    foo();
  }
}

if (foo) bar();
else if (baz) boom();
`;

test('Stroustrup style test', () => {
  const formattedCode = format(exampleCode, {
    ...baseOptions,
    // @ts-ignore
    braceStyle: 'stroustrup',
  });

  expect(formattedCode).toBe(expectedResult);
});
