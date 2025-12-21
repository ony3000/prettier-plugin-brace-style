import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'single line comment (1)',
    input: `//class Foo {}`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `// function foo() {
//   bar;
// }`,
  },
  {
    name: 'multi line comment',
    input: `/*
if (foo) {
  bar();
} else {
  baz();
}
*/`,
  },
];
