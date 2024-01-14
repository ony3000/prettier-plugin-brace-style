import { describe, expect, test } from 'vitest';
import type { Fixture } from '../../settings';
import { format, baseOptions, oneTBSLinter } from '../../settings';

const options = {
  ...baseOptions,
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
    const promise = format(fixture.input, options);

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
