import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: '1tbs',
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

describe('typescript/for/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
