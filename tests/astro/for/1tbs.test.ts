import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'for',
    input: `
---
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
---

<script>
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
</script>
`,
    output: `---
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
---

<script>
  for (let i = 0; i < 9; i++) {
    console.log(i);
    // more statements
  }
</script>
`,
  },
  {
    name: 'for...in',
    input: `
---
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
---

<script>
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
</script>
`,
    output: `---
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
---

<script>
  const obj = { a: 1, b: 2, c: 3 };

  for (const prop in obj) {
    console.log(\`\${prop}: \${obj[prop]}\`);
  }
</script>
`,
  },
  {
    name: 'for...of',
    input: `
---
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
---

<script>
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
</script>
`,
    output: `---
const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
---

<script>
  const array1 = ["a", "b", "c"];

  for (const element of array1) {
    console.log(element);
  }
</script>
`,
  },
  {
    name: 'for await...of',
    input: `
---
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
---

<script>
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
</script>
`,
    output: `---
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
---

<script>
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
</script>
`,
  },
];

describe('astro/for/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
