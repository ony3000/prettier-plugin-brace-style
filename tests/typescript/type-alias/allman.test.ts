import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'type alias',
    input: `
type Point = {
  x: number;
  y: number;
};
`,
    output: `type Point = {
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
    output: `type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};
`,
  },
];

describe('typescript/type-alias/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
