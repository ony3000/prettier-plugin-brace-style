import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'class declaration - empty method',
    input: `
---
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
---

<script>
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>
`,
    output: `---
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
---

<script>
  class BaseQueue {
    onFlush() {}

    onFlushFail() {}

    onFlushSuccess() {}
  }
</script>
`,
  },
];

describe('astro/issue-25/stroustrup', () => {
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
