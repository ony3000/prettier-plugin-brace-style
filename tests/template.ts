import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v?-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'parser-name',
};

const fixtures: Fixture[] = [
  {
    name: '',
    input: ``,
    output: ``,
  },
];

describe('parser-name/test-name', () => {
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