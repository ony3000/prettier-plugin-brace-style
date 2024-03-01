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
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: '`is:inline` directive',
    input: `
<script is:inline>
if (foo) {
  bar();
}
else {
  baz();
}
</script>
`,
    output: `<script is:inline>
  if (foo)
  {
    bar();
  }
  else
  {
    baz();
  }
</script>
`,
  },
];

describe('astro/script/allman', () => {
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
