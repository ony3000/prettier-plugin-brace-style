import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'stroustrup',
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

describe('vue/comment/stroustrup', () => {
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
