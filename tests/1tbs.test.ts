import prettier from 'prettier';

import { braceStylePlugin } from '@/index';
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
  const formattedCode = prettier.format(exampleCode, {
    parser: 'typescript',
    plugins: [braceStylePlugin],
    // @ts-ignore
    braceStyle: '1tbs',
  });

  expect(formattedCode).toBe(expectedResult);
});

test('one true brace style test #2 (Default options can be omitted.)', () => {
  const formattedCode = prettier.format(exampleCode, {
    parser: 'typescript',
    plugins: [braceStylePlugin],
  });

  expect(formattedCode).toBe(expectedResult);
});
