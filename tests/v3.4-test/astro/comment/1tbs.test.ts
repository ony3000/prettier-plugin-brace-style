import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', 'ppbs-070'],
  parser: 'astro',
  braceStyle: '1tbs',
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

describe('astro/comment/1tbs', () => {
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
