import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'while',
    input: `
let n = 0;

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
  },
];
