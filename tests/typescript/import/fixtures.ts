import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'named import (1)',
    input: `import { foo } from 'foo'`,
  },
  {
    name: 'named import (2)',
    input: `import {
  foo,
  bar,
  baz,
} from 'foo'`,
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
  },
];
