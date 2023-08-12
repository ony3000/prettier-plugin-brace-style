import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'empty enum',
    input: `
enum Foo {}
`,
    output: `enum Foo {}
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
    output: `enum Direction {
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
    output: `enum Direction {
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
    output: `enum BooleanLikeHeterogeneousEnum {
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
    output: `enum FileAccess {
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
    output: `const enum Enum {
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
    output: `declare enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
`,
  },
];

describe('typescript/enum/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
