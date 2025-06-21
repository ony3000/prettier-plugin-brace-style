import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { oneTBSLinter } from '../../../test-settings/linter';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'labeled block',
    input: `foo: {
  console.log("face");
  break foo;
  console.log("this will not be executed");
}
console.log("swap");`,
    output: `foo: {
  console.log("face");
  break foo;
  console.log("this will not be executed");
}
console.log("swap");
`,
  },
];

describe('babel/label/1tbs', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await oneTBSLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
