import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment (1)',
    input: `const foo = {}`,
  },
  {
    name: 'object assignment (2)',
    input: `const foo = {
  bar: {
    baz: 'baz'
  }
}`,
  },
  {
    name: 'object assignment (3)',
    input: `const foo = {
  bar() {},
  ['baz']() {}
}`,
  },
  {
    name: 'conditional assignment (1)',
    input: `const foo = true && {
  bar: 'baz'
}`,
  },
  {
    name: 'conditional assignment (2)',
    input: `const foo = false || {
  bar: 'baz'
}`,
  },
  {
    name: 'conditional assignment (3)',
    input: `const foo = null ?? {
  bar: 'baz'
}`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `const {foo, bar: {baz}} = {}`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `try {
  // code
} catch ({ data: { message: { errors }}}) {
  // code
}`,
  },
];
