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
} catch (e) {
  handleError();
}

if (foo) {
  bar();
} else {
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

test('one true brace style test', () => {
  const formattedCode = format(exampleCode, {
    ...baseOptions,
    // @ts-ignore
    braceStyle: '1tbs',
  });

  expect(formattedCode).toBe(expectedResult);
});

test('one true brace style test #2 (Default options can be omitted.)', () => {
  const formattedCode = format(exampleCode, {
    ...baseOptions,
  });

  expect(formattedCode).toBe(expectedResult);
});
