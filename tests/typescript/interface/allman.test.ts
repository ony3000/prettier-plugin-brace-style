import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
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
