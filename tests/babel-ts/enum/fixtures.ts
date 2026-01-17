import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'empty enum',
    input: `
enum Foo {}
`,
  },
  {
    name: 'numeric enum',
    input: `
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
`,
  },
  {
    name: 'string enum',
    input: `
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
`,
  },
  {
    name: 'heterogeneous enum',
    input: `
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
`,
  },
  {
    name: 'computed and constant members',
    input: `
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length,
}
`,
  },
  {
    name: 'const enum',
    input: `
const enum Enum {
  A = 1,
  B = A * 2,
}
`,
  },
  {
    name: 'ambient enum',
    input: `
declare enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}
`,
  },
];
