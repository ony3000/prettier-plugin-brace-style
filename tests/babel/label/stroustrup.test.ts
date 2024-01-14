import { describe, expect, test } from 'vitest';
import type { Fixture } from '../../settings';
import { format, baseOptions, stroustrupLinter } from '../../settings';

const options = {
  ...baseOptions,
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
    const formattedText = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await stroustrupLinter.lintText(formattedText);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', () => {
        expect(formattedText).toBe(fixture.output);
      });
    });
  }
});
