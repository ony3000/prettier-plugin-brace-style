import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'single line comment (1)',
    input: `//class Foo {}`,
    output: `//class Foo {}
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `// function foo() {
//   bar;
// }`,
    output: `// function foo() {
//   bar;
// }
`,
  },
  {
    name: 'multi line comment',
    input: `/*
if (foo) {
  bar();
} else {
  baz();
}
*/`,
    output: `/*
if (foo) {
  bar();
} else {
  baz();
}
*/
`,
  },
];

describe('typescript/comment/allman', () => {
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
