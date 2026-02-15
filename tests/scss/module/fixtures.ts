import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}
`,
  },
];
