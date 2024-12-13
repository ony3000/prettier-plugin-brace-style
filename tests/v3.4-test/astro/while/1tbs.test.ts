import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', 'ppbs-070'],
  parser: 'astro',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'while',
    input: `
---
let n = 0;

while (n < 3) {
  n++;
}
---

<script>
let n = 0;

while (n < 3) {
  n++;
}
</script>
`,
    output: `---
let n = 0;

while (n < 3) {
  n++;
}
---

<script>
  let n = 0;

  while (n < 3) {
    n++;
  }
</script>
`,
  },
  {
    name: 'do...while',
    input: `
---
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
---

<script>
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>
`,
    output: `---
let result = "";
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
---

<script>
  let result = "";
  let i = 0;

  do {
    i = i + 1;
    result = result + i;
  } while (i < 5);
</script>
`,
  },
];

describe('astro/while/1tbs', () => {
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
