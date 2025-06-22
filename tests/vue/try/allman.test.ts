import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'try...catch',
    input: `
<script setup lang="ts">
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
try
{
  throw new TypeError("oops");
}
catch (ex)
{
  console.log(ex.name);
  console.log(ex.message);
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        try
        {
          throw new TypeError('oops');
        }
        catch (ex)
        {
          console.log(ex.name);
          console.log(ex.message);
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
    name: 'try...finally',
    input: `
<script setup lang="ts">
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
openMyFile();
try
{
  writeMyFile(theData);
}
finally
{
  closeMyFile();
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        openMyFile();
        try
        {
          writeMyFile(theData);
        }
        finally
        {
          closeMyFile();
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
    name: 'try...catch...finally',
    input: `
<script setup lang="ts">
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
</script>

<template>
  <button
    type="button"
    @click="() => {
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
try
{
  throw new Error("oops");
}
catch (ex)
{
  console.error(ex.message);
}
finally
{
  console.log("finally");
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        try
        {
          throw new Error('oops');
        }
        catch (ex)
        {
          console.error(ex.message);
        }
        finally
        {
          console.log('finally');
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
    name: 'nested try',
    input: `
<script setup lang="ts">
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
try
{
  try
  {
    throw new Error("oops");
  }
  finally
  {
    console.log("finally");
  }
}
catch (ex)
{
  console.error("outer", ex.message);
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        try
        {
          try
          {
            throw new Error('oops');
          }
          finally
          {
            console.log('finally');
          }
        }
        catch (ex)
        {
          console.error('outer', ex.message);
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

describe('vue/try/allman', () => {
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
