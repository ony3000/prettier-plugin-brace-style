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
  braceStyle: '1tbs',
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
switch (expr) {
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
      () => {
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
switch (action) {
  case "say_hello": {
    const message = "hello";
    console.log(message);
    break;
  }
  case "say_hi": {
    const message = "hi";
    console.log(message);
    break;
  }
  default: {
    console.log("Empty action received.");
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
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
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'switch (3) - complex expression',
    input: `
<script setup lang="ts">
switch (expr.toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (expr.toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
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
switch (expr.toLowerCase()) {
  case "oranges":
    console.log("oranges");
    break;
  case "mangoes":
  case "papayas":
    console.log("mangoes and papayas");
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        switch (expr.toLowerCase()) {
          case 'oranges':
            console.log('oranges');
            break;
          case 'mangoes':
          case 'papayas':
            console.log('mangoes and papayas');
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
    name: 'switch (4) - more complex expression',
    input: `
<script setup lang="ts">
switch (String(expr).split('').map(x => x).join('').toUpperCase().toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (String(expr).split('').map(x => x).join('').toUpperCase().toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
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
switch (
  String(expr)
    .split("")
    .map((x) => x)
    .join("")
    .toUpperCase()
    .toLowerCase()
) {
  case "oranges":
    console.log("oranges");
    break;
  case "mangoes":
  case "papayas":
    console.log("mangoes and papayas");
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        switch (
          String(expr)
            .split('')
            .map((x) => x)
            .join('')
            .toUpperCase()
            .toLowerCase()
        ) {
          case 'oranges':
            console.log('oranges');
            break;
          case 'mangoes':
          case 'papayas':
            console.log('mangoes and papayas');
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
];

describe('vue/switch/1tbs', () => {
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
