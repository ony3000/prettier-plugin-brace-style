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
    name: 'global augmentation',
    input: `
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
`,
    output: `declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
`,
  },
];

describe('typescript/global/stroustrup', () => {
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
