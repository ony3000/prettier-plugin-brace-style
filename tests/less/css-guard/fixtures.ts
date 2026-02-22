import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
button when (@my-option = true) {
  color: white;
}

& when (@my-option = true) {
  button {
    color: white;
  }
  a {
    color: blue;
  }
}
`,
  },
];
