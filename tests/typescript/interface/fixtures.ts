import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'interface declaration',
    input: `
interface Point {
  x: number;
  y: number;
}
`,
  },
  {
    name: 'extending an interface',
    input: `
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}
`,
  },
];
