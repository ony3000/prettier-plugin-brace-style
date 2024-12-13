import { format } from 'prettier';
import { baseOptions } from 'test-settings';
import { expect, test } from 'vitest';

import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', 'ppbs-070'],
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
