import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'variable declaration (1) - containing only comments in brackets',
    input: `
<script setup lang="ts">
const foo = [
  // elements
];
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = [
  // elements
];
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  // elements
];
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        const foo = [
          // elements
        ];
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'variable declaration (2) - containing only comments in brackets',
    input: `
<script setup lang="ts">
const foo = [
  /* elements */
];
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = [
  /* elements */
];
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  /* elements */
];
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        const foo = [
          /* elements */
        ];
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'variable declaration (3) - containing only comments in brackets',
    input: `
<script setup lang="ts">
const foo = [/* elements */];
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = [/* elements */];
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  /* elements */
];
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        const foo = [
          /* elements */
        ];
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'variable declaration (4) - containing only comments in brackets',
    input: `
<script setup lang="ts">
const foo = [// element
  /* element */
  // element
/* element */];
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = [// element
  /* element */
  // element
/* element */];
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  // element
  /* element */
  // element
  /* element */
];
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        const foo = [
          // element
          /* element */
          // element
          /* element */
        ];
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/variable-declaration/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
