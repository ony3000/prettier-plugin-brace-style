import { format, baseOptions } from '../settings';
import { forCode, forInCode, forOfCode, forAwaitOfCode } from './fixtures';

const options = {
  ...baseOptions,
  braceStyle: 'stroustrup',
};

describe('stroustrup - for statements', () => {
  test('for', () => {
    const expectedResult = `for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
`;

    expect(format(forCode, options)).toBe(expectedResult);
  });

  test('for...in', () => {
    const expectedResult = `const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
`;

    expect(format(forInCode, options)).toBe(expectedResult);
  });

  test('for...of', () => {
    const expectedResult = `const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
`;

    expect(format(forOfCode, options)).toBe(expectedResult);
  });

  test('for await...of', () => {
    const expectedResult = `async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
`;

    expect(format(forAwaitOfCode, options)).toBe(expectedResult);
  });
});
