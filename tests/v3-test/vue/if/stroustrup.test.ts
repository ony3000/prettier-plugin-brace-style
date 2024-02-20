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
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'if (1)',
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
if (foo) {
  bar();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
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
    @click="
      () => {
        if (foo) {
          bar();
        }
        else {
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
    name: 'if...elseif...else (1)',
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
if (foo) {
  bar();
}
else if (baz) {
  qux();
}
else {
  quux();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
          bar();
        }
        else if (baz) {
          qux();
        }
        else {
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
    @click="
      () => {
        // foo is truthy
        if (foo) {
          bar();
        }
        // foo is falsy
        else {
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
    name: 'if (2) - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition) {
  // statement
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {
  // statement
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  // statement
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          // statement
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
    name: 'if (3) - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {
  /* statement */
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
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
    name: 'if (4) - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition) {/* statement */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {/* statement */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
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
    name: 'if (5) - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition) {/* statement */
  // statement
/* statement */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {/* statement */
  // statement
/* statement */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
  // statement
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
          // statement
          /* statement */
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
    name: 'if...elseif...else (2) - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition1) {
  /* statement1 */
}
else if (condition2) {
  /* statement2 */
}
else {
  /* statement3 */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          /* statement1 */
        }
        else if (condition2) {
          /* statement2 */
        }
        else {
          /* statement3 */
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
    name: 'nested if - containing only comments in brackets',
    input: `
<script setup lang="ts">
if (condition1) {
  if (condition2) {/* statement */}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  if (condition2) {/* statement */}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition1) {
  if (condition2) {
    /* statement */
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          if (condition2) {
            /* statement */
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

describe('vue/if/stroustrup', () => {
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
