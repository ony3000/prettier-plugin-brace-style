import { format } from 'prettier';
import { expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  braceStyle: 'stroustrup',
};

for (const fixture of fixtures) {
  test(fixture.name, async () => {
    expect(
      await format(fixture.input, {
        ...options,
        ...(fixture.options ?? {}),
      }),
    ).toMatchSnapshot();
  });
}
