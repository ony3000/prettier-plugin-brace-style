import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { allmanLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'babel',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'while',
    input: `
let n = 0;

while (n < 3) {
  n++;
}
`,
    output: `let n = 0;

while (n < 3)
{
  n++;
}
`,
  },
  {
    name: 'do...while',
    input: `
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
`,
    output: `let result = "";
let i = 0;

do
{
  i = i + 1;
  result = result + i;
} while (i < 5);
`,
  },
];

describe('babel/while/allman', () => {
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
