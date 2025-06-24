import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
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

describe('typescript/export/stroustrup', () => {
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
