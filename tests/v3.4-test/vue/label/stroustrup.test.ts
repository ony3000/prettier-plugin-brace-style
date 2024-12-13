import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'vue',
  braceStyle: 'stroustrup',
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

describe('vue/label/stroustrup', () => {
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
