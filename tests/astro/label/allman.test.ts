import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'allman',
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
foo:
{
  console.log("face");
  break foo;
  console.log("this will not be executed");
}
console.log("swap");
---

<script>
  foo:
  {
    console.log("face");
    break foo;
    console.log("this will not be executed");
  }
  console.log("swap");
</script>
`,
  },
];

describe('astro/label/allman', () => {
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
