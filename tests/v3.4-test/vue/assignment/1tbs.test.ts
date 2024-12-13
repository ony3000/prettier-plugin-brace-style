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
    name: 'object assignment (1)',
    input: `
<script setup lang="ts">
const foo = {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment (2)',
    input: `
<script setup lang="ts">
const foo = {
  bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar: {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar: {
    baz: "baz",
  },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar: {
            baz: 'baz',
          },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment (3)',
    input: `
<script setup lang="ts">
const foo = {
  bar() {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar() {},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>

`,
    output: `<script setup lang="ts">
const foo = {
  bar() {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar() {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (1)',
    input: `
<script setup lang="ts">
const foo = true && {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = true && {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = true && {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = true && {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `
<script setup lang="ts">
const foo = false || {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = false || {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = false || {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = false || {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `
<script setup lang="ts">
const foo = null ?? {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = null ?? {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = null ?? {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = null ?? {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `
<script setup lang="ts">
const {foo, bar: {baz}} = {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const {foo, bar: {baz}} = {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const {
  foo,
  bar: { baz },
} = {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const {
          foo,
          bar: { baz },
        } = {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `
<script setup lang="ts">
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>

<template>
  <button
    type="button"
    @click="() => {
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
arr.forEach(
  ({
    data: {
      message: { errors },
    },
  }) => {
    // code
  },
);
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        arr.forEach(
          ({
            data: {
              message: { errors },
            },
          }) => {
            // code
          },
        );
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/assignment/1tbs', () => {
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
