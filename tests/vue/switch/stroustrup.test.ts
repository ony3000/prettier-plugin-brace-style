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

describe('vue/switch/stroustrup', () => {
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
