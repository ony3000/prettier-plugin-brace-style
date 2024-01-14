import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions, allmanLinter } from '../../settings';

const options = {
  ...baseOptions,
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
    const formattedText = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await allmanLinter.lintText(formattedText);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', () => {
        expect(formattedText).toBe(fixture.output);
      });
    });
  }
});
