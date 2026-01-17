import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'namespacing',
    input: `
namespace Validation {
  export interface StringValidator {
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
  },
];
