import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal',
    input: `
<script setup lang="ts">
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

<template>
  <button
    type="button"
    @click="() => {
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
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
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

<template>
  <button
    type="button"
    @click="
      () => {
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
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'nested template literal',
    input: `
<script setup lang="ts">
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
</script>

<template>
  <button
    type="button"
    @click="() => {
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const x = \`foo: \${
  1 +
  (function () {
    return 2;
  })() +
  3
}\`;
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const x = \`foo: \${
          1 +
          (function () {
            return 2;
          })() +
          3
        }\`;
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/template-literal/1tbs', () => {
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
