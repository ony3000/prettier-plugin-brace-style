import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'named import #1',
    input: `import { foo } from 'foo'`,
    output: `import { foo } from "foo";
`,
  },
  {
    name: 'named import #2',
    input: `import {
  foo,
  bar,
  baz,
} from 'foo'`,
    output: `import { foo, bar, baz } from "foo";
`,
  },
  {
    name: 'named import #3',
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

describe('babel/import/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
