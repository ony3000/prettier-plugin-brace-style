import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'while',
    input: `
let n = 0;

while (n < 3) {
  n++;
}
`,
    output: `let n = 0;

while (n < 3) {
  n++;
}
`,
  },
  {
    name: 'do...while',
    input: `
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
`,
    output: `let result = "";
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
`,
  },
];

describe('typescript/while/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
