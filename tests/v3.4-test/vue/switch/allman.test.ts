import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'switch (1)',
    input: `
<script setup lang="ts">
switch (expr) {
  case 'Oranges':
    console.log('Oranges');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (expr) {
  case 'Oranges':
    console.log('Oranges');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas');
    break;
  default:
    console.log(expr);
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
switch (expr)
{
  case "Oranges":
    console.log("Oranges");
    break;
  case "Mangoes":
  case "Papayas":
    console.log("Mangoes and papayas");
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        switch (expr)
        {
          case 'Oranges':
            console.log('Oranges');
            break;
          case 'Mangoes':
          case 'Papayas':
            console.log('Mangoes and papayas');
            break;
          default:
            console.log(expr);
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
    name: 'switch (2) - case with block',
    input: `
<script setup lang="ts">
switch (action) {
  case 'say_hello': {
    const message = 'hello';
    console.log(message);
    break;
  }
  case 'say_hi': {
    const message = 'hi';
    console.log(message);
    break;
  }
  default: {
    console.log('Empty action received.');
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (action) {
  case 'say_hello': {
    const message = 'hello';
    console.log(message);
    break;
  }
  case 'say_hi': {
    const message = 'hi';
    console.log(message);
    break;
  }
  default: {
    console.log('Empty action received.');
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
switch (action)
{
  case "say_hello":
  {
    const message = "hello";
    console.log(message);
    break;
  }
  case "say_hi":
  {
    const message = "hi";
    console.log(message);
    break;
  }
  default:
  {
    console.log("Empty action received.");
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        switch (action)
        {
          case 'say_hello':
          {
            const message = 'hello';
            console.log(message);
            break;
          }
          case 'say_hi':
          {
            const message = 'hi';
            console.log(message);
            break;
          }
          default:
          {
            console.log('Empty action received.');
          }
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/switch/allman', () => {
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
