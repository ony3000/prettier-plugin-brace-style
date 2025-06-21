import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'if',
    input: `
<script setup lang="ts">
if (foo)
{
  bar();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo)
{
  bar();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo)
{
  bar();
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        if (foo)
        {
          bar();
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
    name: 'if...else (1)',
    input: `
<script setup lang="ts">
if (foo) {
  bar();
}
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo)
{
  bar();
}
else
{
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        if (foo)
        {
          bar();
        }
        else
        {
          baz();
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
    name: 'if...elseif...else',
    input: `
<script setup lang="ts">
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo)
{
  bar();
}
else if (baz)
{
  qux();
}
else
{
  quux();
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        if (foo)
        {
          bar();
        }
        else if (baz)
        {
          qux();
        }
        else
        {
          quux();
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
    name: 'if...else (2) - with comment',
    input: `
<script setup lang="ts">
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
// foo is truthy
if (foo)
{
  bar();
}
// foo is falsy
else
{
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        // foo is truthy
        if (foo)
        {
          bar();
        }
        // foo is falsy
        else
        {
          baz();
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

describe('vue/if/allman', () => {
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
