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
    name: 'ignore comment (1)',
    input: `
<script setup lang="ts">
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="() => {
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        // prettier-ignore
        if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
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
    name: 'ignore comment (2)',
    input: `
<script setup lang="ts">
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="() => {
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        /* prettier-ignore */
        if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
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
    name: 'ignore comment (3)',
    input: `
<!-- prettier-ignore -->
<template>
  <div>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
  </div>
</template>
`,
    output: `<!-- prettier-ignore -->
<template>
  <div>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
  </div>
</template>
`,
  },
  {
    name: 'ignore comment (4)',
    input: `
<template>
  <div>
    <!-- prettier-ignore -->
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
  </div>
</template>
`,
    output: `<template>
  <div>
    <!-- prettier-ignore -->
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="
        () => {
          console.log('click');
        }
      "
    >
      Click Me
    </button>
  </div>
</template>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
<script setup lang="ts">
/**
 * prettier-ignore
 */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<!--
 ! prettier-ignore
-->
<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
/**
 * prettier-ignore
 */
if (condition1) {
  foo;
}
else if (condition2) {
  bar;
}
else {
  baz;
}
</script>

<!--
 ! prettier-ignore
-->
<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          foo;
        }
        else if (condition2) {
          bar;
        }
        else {
          baz;
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
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
<script setup lang="ts">
// /* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<!-- /* prettier-ignore */ -->
<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
// /* prettier-ignore */
if (condition1) {
  foo;
}
else if (condition2) {
  bar;
}
else {
  baz;
}
</script>

<!-- /* prettier-ignore */ -->
<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          foo;
        }
        else if (condition2) {
          bar;
        }
        else {
          baz;
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

describe('vue/prettier-ignore/stroustrup', () => {
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
