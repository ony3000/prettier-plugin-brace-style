import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'child combinator',
    input: `
span {
  background-color: aqua;
}

div > span {
  background-color: yellow;
}
`,
  },
  {
    name: 'descendant combinator',
    input: `
li {
  list-style-type: disc;
}

li li {
  list-style-type: circle;
}
`,
  },
  {
    name: 'next-sibling combinator',
    input: `
li:first-of-type + li {
  color: red;
  font-weight: bold;
}
`,
  },
  {
    name: 'subsequent-sibling combinator',
    input: `
p ~ span {
  color: red;
}
`,
  },
];
