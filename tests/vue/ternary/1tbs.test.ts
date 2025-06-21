import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'ternary operator',
    input: `
<script setup lang="ts">
const x = condition ? function foo() {} : function bar() {return 0;}
</script>

<template>
  <button
    type="button"
    @click="() => {
const x = condition ? function foo() {} : function bar() {return 0;}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const x = condition
  ? function foo() {}
  : function bar() {
      return 0;
    };
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const x = condition
          ? function foo() {}
          : function bar() {
              return 0;
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
    name: 'nested ternary operator',
    input: `
<script setup lang="ts">
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
</script>

<template>
  <button
    type="button"
    @click="() => {
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const x = condition1
  ? condition2
    ? function foo() {}
    : function bar() {
        return 0;
      }
  : condition3
    ? function baz() {}
    : function qux() {
        return 0;
      };
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const x = condition1
          ? condition2
            ? function foo() {}
            : function bar() {
                return 0;
              }
          : condition3
            ? function baz() {}
            : function qux() {
                return 0;
              };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/ternary/1tbs', () => {
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
