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
    name: 'while',
    input: `
<script setup lang="ts">
let n = 0;

while (n < 3) {
  n++;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
let n = 0;

while (n < 3) {
  n++;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
let n = 0;

while (n < 3) {
  n++;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        let n = 0;

        while (n < 3) {
          n++;
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'do...while',
    input: `
<script setup lang="ts">
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>

<template>
  <button
    type="button"
    @click="() => {
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
let result = "";
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        let result = '';
        let i = 0;

        do {
          i = i + 1;
          result = result + i;
        } while (i < 5);
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/while/1tbs', () => {
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
