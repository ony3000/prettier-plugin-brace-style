import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'namespacing',
    input: `
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
`,
    output: `namespace Validation
{
  export interface StringValidator
  {
    isAcceptable(s: string): boolean;
  }
}
`,
  },
  {
    name: 'alias',
    input: `
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
`,
    output: `namespace Shapes
{
  export namespace Polygons
  {
    export class Triangle
    {}
    export class Square
    {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
`,
  },
  {
    name: 'ambient namespace',
    input: `
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }
}
`,
    output: `declare namespace D3
{
  export interface Selectors
  {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }
}
`,
  },
];

describe('typescript/namespace/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
