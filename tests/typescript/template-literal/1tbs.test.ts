import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: '1tbs',
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

describe('typescript/template-literal/1tbs', () => {
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
