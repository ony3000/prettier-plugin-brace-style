import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions, stroustrupLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'for',
    input: `
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
`,
    output: `for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
`,
  },
  {
    name: 'for...in',
    input: `
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
`,
    output: `const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
`,
  },
  {
    name: 'for...of',
    input: `
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
`,
    output: `const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
`,
  },
  {
    name: 'for await...of',
    input: `
async function* asyncGenerator() {
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
`,
    output: `async function* asyncGenerator() {
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
`,
  },
];

describe('babel/for/stroustrup', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await stroustrupLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
