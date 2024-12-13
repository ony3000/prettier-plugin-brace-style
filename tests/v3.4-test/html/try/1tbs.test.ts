import { format } from 'prettier';
import { baseOptions } from 'test-settings';
import { expect, test } from 'vitest';

import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'html',
  braceStyle: '1tbs',
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
