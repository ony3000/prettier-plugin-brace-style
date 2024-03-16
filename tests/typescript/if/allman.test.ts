import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
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
    name: 'if...else',
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
    name: 'if...else (with comment)',
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
  {
    name: 'if (containing only comments in brackets #1)',
    input: `
if (condition) {
  // statement
}
`,
    output: `if (condition)
{
  // statement
}
`,
  },
  {
    name: 'if (containing only comments in brackets #2)',
    input: `
if (condition) {
  /* statement */
}
`,
    output: `if (condition)
{
  /* statement */
}
`,
  },
  {
    name: 'if (containing only comments in brackets #3)',
    input: `
if (condition) {/* statement */}
`,
    output: `if (condition)
{
  /* statement */
}
`,
  },
  {
    name: 'if (containing only comments in brackets #4)',
    input: `
if (condition) {/* statement */
  // statement
/* statement */}
`,
    output: `if (condition)
{
  /* statement */
  // statement
  /* statement */
}
`,
  },
  {
    name: 'if...elseif...else (containing only comments in brackets)',
    input: `
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
`,
    output: `if (condition1)
{
  /* statement1 */
}
else if (condition2)
{
  /* statement2 */
}
else
{
  /* statement3 */
}
`,
  },
  {
    name: 'nested if (containing only comments in brackets)',
    input: `
if (condition1) {
  if (condition2) {/* statement */}
}
`,
    output: `if (condition1)
{
  if (condition2)
  {
    /* statement */
  }
}
`,
  },
];

describe('typescript/if/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      // @ts-ignore
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
