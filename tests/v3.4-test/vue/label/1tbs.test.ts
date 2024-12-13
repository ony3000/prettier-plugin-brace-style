import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'labeled block',
    input: `
<script setup lang="ts">
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
</script>

<template>
  <button
    type="button"
    @click="() => {
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
foo: {
  console.log("face");
  break foo;
  console.log("this will not be executed");
}
console.log("swap");
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        foo: {
          console.log('face');
          break foo;
          console.log('this will not be executed');
        }
        console.log('swap');
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/label/1tbs', () => {
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
