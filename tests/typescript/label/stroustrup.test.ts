import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
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

describe('typescript/label/stroustrup', () => {
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
