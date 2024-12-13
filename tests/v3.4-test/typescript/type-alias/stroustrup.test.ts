import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'typescript',
  braceStyle: 'stroustrup',
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

describe('typescript/type-alias/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
