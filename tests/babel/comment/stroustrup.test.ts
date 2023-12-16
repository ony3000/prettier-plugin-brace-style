import type { Fixture } from '../../settings';
import { format, baseOptions, stroustrupLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'single line comment',
    input: `//class Foo {}`,
    output: `//class Foo {}
`,
  },
  {
    name: 'single line comment applied to multi line',
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
