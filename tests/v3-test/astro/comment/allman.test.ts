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
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'single line comment (1)',
    input: `
---
//class Foo {}
---

<script>
//class Foo {}
</script>
`,
    output: `---
//class Foo {}
---

<script>
  //class Foo {}
</script>
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `
---
// function foo() {
//   bar;
// }
---

<script>
// function foo() {
//   bar;
// }
</script>
`,
    output: `---
// function foo() {
//   bar;
// }
---

<script>
  // function foo() {
  //   bar;
  // }
</script>
`,
  },
  {
    name: 'multi line comment',
    input: `
---
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
---

<script>
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>
`,
    output: `---
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
---

<script>
  /*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>
`,
  },
];

describe('astro/comment/allman', () => {
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
