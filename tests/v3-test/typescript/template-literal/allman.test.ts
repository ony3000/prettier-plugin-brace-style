import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'allman',
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
  (function ()
  {
    return 2;
  })() +
  3
}\`;
`,
  },
];

describe('typescript/template-literal/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
