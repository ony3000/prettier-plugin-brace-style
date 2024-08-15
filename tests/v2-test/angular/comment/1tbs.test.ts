import { format } from 'prettier';
import { baseOptions } from 'test-settings';
import { expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'angular',
  braceStyle: '1tbs',
};

for (const fixture of fixtures) {
  test(fixture.name, () => {
    expect(
      format(fixture.input, {
        ...options,
        ...(fixture.options ?? {}),
      }),
    ).toMatchSnapshot();
  });
}
