import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import { allmanLinter } from '../../linters';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
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

describe('babel/if/allman', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await allmanLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
