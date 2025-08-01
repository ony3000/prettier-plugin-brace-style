import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

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
    name: 'template literal',
    input: `
---
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
---

<script>
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
</script>
`,
    output: `---
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`;
---

<script>
  const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`;
</script>
`,
  },
  {
    name: 'nested template literal',
    input: `
---
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
---

<script>
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
</script>
`,
    output: `---
const x = \`foo: \${
  1 +
  (function () {
    return 2;
  })() +
  3
}\`;
---

<script>
  const x = \`foo: \${
    1 +
    (function () {
      return 2;
    })() +
    3
  }\`;
</script>
`,
  },
];

describe('astro/template-literal/1tbs', () => {
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
