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
    name: 'if',
    input: `
---
if (foo)
{
  bar();
}
---

<script>
if (foo)
{
  bar();
}
</script>
`,
    output: `---
if (foo)
{
  bar();
}
---

<script>
  if (foo)
  {
    bar();
  }
</script>
`,
  },
  {
    name: 'if...else (1)',
    input: `
---
if (foo) {
  bar();
}
else {
  baz();
}
---

<script>
if (foo) {
  bar();
}
else {
  baz();
}
</script>
`,
    output: `---
if (foo)
{
  bar();
}
else
{
  baz();
}
---

<script>
  if (foo)
  {
    bar();
  }
  else
  {
    baz();
  }
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
---
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
---

<script>
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>
`,
    output: `---
if (foo)
{
  bar();
}
else if (baz)
{
  qux();
}
else
{
  quux();
}
---

<script>
  if (foo)
  {
    bar();
  }
  else if (baz)
  {
    qux();
  }
  else
  {
    quux();
  }
</script>
`,
  },
  {
    name: 'if...else (2) - with comment',
    input: `
---
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
---

<script>
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>
`,
    output: `---
// foo is truthy
if (foo)
{
  bar();
}
// foo is falsy
else
{
  baz();
}
---

<script>
  // foo is truthy
  if (foo)
  {
    bar();
  }
  // foo is falsy
  else
  {
    baz();
  }
</script>
`,
  },
];

describe('astro/if/allman', () => {
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
