import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'variable declaration (containing only comments in brackets #1)',
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
    name: 'variable declaration (containing only comments in brackets #2)',
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
    name: 'variable declaration (containing only comments in brackets #3)',
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
    name: 'variable declaration (containing only comments in brackets #4)',
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
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
