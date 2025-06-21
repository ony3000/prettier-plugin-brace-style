import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/index';

import { oneTBSLinter } from '../../linters';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
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

describe('babel/import/1tbs', () => {
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
