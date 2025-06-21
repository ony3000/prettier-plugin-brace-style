import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
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
