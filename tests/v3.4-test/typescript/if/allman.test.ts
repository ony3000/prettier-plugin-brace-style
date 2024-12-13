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
    name: 'if',
    input: `
if (foo)
{
  bar();
}
`,
    output: `if (foo)
{
  bar();
}
`,
  },
  {
    name: 'if...else (1)',
    input: `
if (foo) {
  bar();
}
else {
  baz();
}
`,
    output: `if (foo)
{
  bar();
}
else
{
  baz();
}
`,
  },
  {
    name: 'if...elseif...else',
    input: `
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
`,
    output: `if (foo)
{
  bar();
}
else if (baz)
{
  qux();
}
else
{
  quux();
}
`,
  },
  {
    name: 'if...else (2) - with comment',
    input: `
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
`,
    output: `// foo is truthy
if (foo)
{
  bar();
}
// foo is falsy
else
{
  baz();
}
`,
  },
];

describe('typescript/if/allman', () => {
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
