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
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'class declaration - empty method',
    input: `
<script setup lang="ts">
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        class BaseQueue {
          onFlush() {}

          onFlushFail() {}

          onFlushSuccess() {}
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

describe('vue/issue-25/stroustrup', () => {
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
