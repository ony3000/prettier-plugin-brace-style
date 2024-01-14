import { describe, expect, test } from 'vitest';
import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'default export #1',
    input: `export default {}`,
    output: `export default {};
`,
  },
  {
    name: 'default export #2',
    input: `export default { foo: 'bar' }`,
    output: `export default { foo: "bar" };
`,
  },
  {
    name: 'default export #3',
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
    name: 'named export #1',
    input: `export {}`,
    output: `export {};
`,
  },
  {
    name: 'named export #2',
    input: `export { foo }`,
    output: `export { foo };
`,
  },
  {
    name: 'named export #3',
    input: `export {
  foo,
  bar as baz,
}`,
    output: `export { foo, bar as baz };
`,
  },
];

describe('typescript/export/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
