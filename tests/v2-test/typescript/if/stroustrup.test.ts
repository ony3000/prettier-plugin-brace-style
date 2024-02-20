import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'if (1)',
    input: `
if (foo)
{
  bar();
}
`,
    output: `if (foo) {
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
    output: `if (foo) {
  bar();
}
else {
  baz();
}
`,
  },
  {
    name: 'if...elseif...else (1)',
    input: `
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
`,
    output: `if (foo) {
  bar();
}
else if (baz) {
  qux();
}
else {
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
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
`,
  },
  {
    name: 'if (2) - containing only comments in brackets',
    input: `
if (condition) {
  // statement
}
`,
    output: `if (condition) {
  // statement
}
`,
  },
  {
    name: 'if (3) - containing only comments in brackets',
    input: `
if (condition) {
  /* statement */
}
`,
    output: `if (condition) {
  /* statement */
}
`,
  },
  {
    name: 'if (4) - containing only comments in brackets',
    input: `
if (condition) {/* statement */}
`,
    output: `if (condition) {
  /* statement */
}
`,
  },
  {
    name: 'if (5) - containing only comments in brackets',
    input: `
if (condition) {/* statement */
  // statement
/* statement */}
`,
    output: `if (condition) {
  /* statement */
  // statement
  /* statement */
}
`,
  },
  {
    name: 'if...elseif...else (2) - containing only comments in brackets',
    input: `
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
`,
    output: `if (condition1) {
  /* statement1 */
}
else if (condition2) {
  /* statement2 */
}
else {
  /* statement3 */
}
`,
  },
  {
    name: 'nested if - containing only comments in brackets',
    input: `
if (condition1) {
  if (condition2) {/* statement */}
}
`,
    output: `if (condition1) {
  if (condition2) {
    /* statement */
  }
}
`,
  },
];

describe('typescript/if/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});