import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal',
    input: `const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\``,
    output: `const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`;
`,
  },
  {
    name: 'nested template literal',
    input: `const x = \`foo: \${1 + (function () { return 2; })() + 3}\``,
    output: `const x = \`foo: \${
  1 +
  (function () {
    return 2;
  })() +
  3
}\`;
`,
  },
];

describe('babel/template-literal/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
