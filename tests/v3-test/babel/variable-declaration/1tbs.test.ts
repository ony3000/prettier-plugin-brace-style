import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { oneTBSLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: '1tbs',
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

describe('babel/variable-declaration/1tbs', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await oneTBSLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
