import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'typescript',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'named import (1)',
    input: `import { foo } from 'foo'`,
    output: `import { foo } from "foo";
`,
  },
  {
    name: 'named import (2)',
    input: `import {
  foo,
  bar,
  baz,
} from 'foo'`,
    output: `import { foo, bar, baz } from "foo";
`,
  },
  {
    name: 'named import (3)',
    input: `import {
  foo,
  bar,
  baz,
  foobar,
  fooBaz,
  barFoo,
  barBaz,
  bazFoo,
  bazBar,
  fooBarBaz,
} from 'foo'`,
    output: `import {
  foo,
  bar,
  baz,
  foobar,
  fooBaz,
  barFoo,
  barBaz,
  bazFoo,
  bazBar,
  fooBarBaz,
} from "foo";
`,
  },
];

describe('typescript/import/1tbs', () => {
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
