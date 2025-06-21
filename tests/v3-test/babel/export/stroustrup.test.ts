import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { stroustrupLinter } from '../../../test-settings/linter';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'default export (1)',
    input: `export default {}`,
    output: `export default {};
`,
  },
  {
    name: 'default export (2)',
    input: `export default { foo: 'bar' }`,
    output: `export default { foo: "bar" };
`,
  },
  {
    name: 'default export (3)',
    input: `export default {
  foo: 'bar',
  baz,
}`,
    output: `export default {
  foo: "bar",
  baz,
};
`,
  },
  {
    name: 'named export (1)',
    input: `export {}`,
    output: `export {};
`,
  },
  {
    name: 'named export (2)',
    input: `export { foo }`,
    output: `export { foo };
`,
  },
  {
    name: 'named export (3)',
    input: `export {
  foo,
  bar as baz,
}`,
    output: `export { foo, bar as baz };
`,
  },
];

describe('babel/export/stroustrup', () => {
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
