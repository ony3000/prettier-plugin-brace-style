import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
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
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
