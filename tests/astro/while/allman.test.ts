import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'allman',
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

while (n < 3)
{
  n++;
}
---

<script>
  let n = 0;

  while (n < 3)
  {
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

do
{
  i = i + 1;
  result = result + i;
} while (i < 5);
---

<script>
  let result = "";
  let i = 0;

  do
  {
    i = i + 1;
    result = result + i;
  } while (i < 5);
</script>
`,
  },
];

describe('astro/while/allman', () => {
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
