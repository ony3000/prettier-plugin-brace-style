import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

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
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
