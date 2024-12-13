import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'single line comment (1)',
    input: `
<script setup lang="ts">
//class Foo {}
</script>

<template>
  <button
    type="button"
    @click="() => {
//class Foo {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
//class Foo {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        //class Foo {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `
<script setup lang="ts">
// function foo() {
//   bar;
// }
</script>

<template>
  <button
    type="button"
    @click="() => {
// function foo() {
//   bar;
// }
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
// function foo() {
//   bar;
// }
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        // function foo() {
        //   bar;
        // }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'multi line comment',
    input: `
<script setup lang="ts">
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>

<template>
  <button
    type="button"
    @click="() => {
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        /*
if (foo) {
  bar();
} else {
  baz();
}
*/
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/comment/1tbs', () => {
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
