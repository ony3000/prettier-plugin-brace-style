import type { Fixture } from '../../settings';
import { format, baseOptions, stroustrupLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'variable declaration (containing only comments in brackets #1)',
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
    name: 'variable declaration (containing only comments in brackets #2)',
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
    name: 'variable declaration (containing only comments in brackets #3)',
    input: `
const foo = [/* elements */];
`,
    output: `const foo = [
  /* elements */
];
`,
  },
  {
    name: 'variable declaration (containing only comments in brackets #4)',
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

describe('babel/variable-declaration/stroustrup', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await stroustrupLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
