import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'labeled block',
    input: `
---
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
---

<script>
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
</script>
`,
    output: `---
foo: {
  console.log("face");
  break foo;
  console.log("this will not be executed");
}
console.log("swap");
---

<script>
  foo: {
    console.log("face");
    break foo;
    console.log("this will not be executed");
  }
  console.log("swap");
</script>
`,
  },
];

describe('astro/label/stroustrup', () => {
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
