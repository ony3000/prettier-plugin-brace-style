import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'type alias',
    input: `
type Point = {
  x: number;
  y: number;
};
`,
  },
  {
    name: 'extending a type via intersections',
    input: `
type Animal = {
  name: string;
}

type Bear = Animal & {
  honey: boolean;
}
`,
  },
];
