import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'global augmentation',
    input: `
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
`,
    output: `declare global
{
  interface Array<T>
  {
    toObservable(): Observable<T>;
  }
}
`,
  },
];

describe('typescript/global/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
