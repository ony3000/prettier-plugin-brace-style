import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { allmanLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'variable declaration (1) - containing only comments in brackets',
    input: `
const foo = [
  // elements
];
`,
    output: `const foo = [
  // elements
];
`,
  },
  {
    name: 'variable declaration (2) - containing only comments in brackets',
    input: `
const foo = [
  /* elements */
];
`,
    output: `const foo = [
  /* elements */
];
`,
  },
  {
    name: 'variable declaration (3) - containing only comments in brackets',
    input: `
const foo = [/* elements */];
`,
    output: `const foo = [
  /* elements */
];
`,
  },
  {
    name: 'variable declaration (4) - containing only comments in brackets',
    input: `
const foo = [// element
  /* element */
  // element
/* element */];
`,
    output: `const foo = [
  // element
  /* element */
  // element
  /* element */
];
`,
  },
];

describe('babel/variable-declaration/allman', () => {
  for (const fixture of fixtures) {
    const formattedText = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

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
