import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import { stroustrupLinter } from '../../linters';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: 'stroustrup',
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

describe('babel/label/stroustrup', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await stroustrupLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
