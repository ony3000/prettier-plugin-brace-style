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
    name: 'interface declaration',
    input: `
interface Point {
  x: number;
  y: number;
}
`,
    output: `interface Point
{
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
    output: `interface Animal
{
  name: string;
}

interface Bear extends Animal
{
  honey: boolean;
}
`,
  },
];

describe('typescript/interface/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
