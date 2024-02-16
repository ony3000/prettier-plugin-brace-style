import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { stroustrupLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'single line comment (1)',
    input: `//class Foo {}`,
    output: `//class Foo {}
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `// function foo() {
//   bar;
// }`,
    output: `// function foo() {
//   bar;
// }
`,
  },
  {
    name: 'multi line comment',
    input: `/*
if (foo) {
  bar();
} else {
  baz();
}
*/`,
    output: `/*
if (foo) {
  bar();
} else {
  baz();
}
*/
`,
  },
];

describe('babel/comment/stroustrup', () => {
  for (const fixture of fixtures) {
    const formattedText = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

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
