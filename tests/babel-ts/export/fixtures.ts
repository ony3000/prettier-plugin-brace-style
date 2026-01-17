import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'default export (1)',
    input: `export default {}`,
  },
  {
    name: 'default export (2)',
    input: `export default { foo: 'bar' }`,
  },
  {
    name: 'default export (3)',
    input: `export default {
  foo: 'bar',
  baz,
}`,
  },
  {
    name: 'named export (1)',
    input: `export {}`,
  },
  {
    name: 'named export (2)',
    input: `export { foo }`,
  },
  {
    name: 'named export (3)',
    input: `export {
  foo,
  bar as baz,
}`,
  },
];
