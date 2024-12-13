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
    name: 'interface declaration',
    input: `
interface Point {
  x: number;
  y: number;
}
`,
    output: `interface Point {
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
    output: `interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}
`,
  },
];

describe('typescript/interface/stroustrup', () => {
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
