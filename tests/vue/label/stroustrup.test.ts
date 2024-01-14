import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
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
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
