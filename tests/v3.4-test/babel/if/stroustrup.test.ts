import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { stroustrupLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'babel',
  braceStyle: 'stroustrup',
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
];

describe('babel/if/stroustrup', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

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
