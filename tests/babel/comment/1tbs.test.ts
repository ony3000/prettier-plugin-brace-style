import type { Fixture } from '../../settings';
import { format, baseOptions, oneTBSLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: '1tbs',
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

describe('babel/comment/1tbs', () => {
  for (const fixture of fixtures) {
    const formattedText = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await oneTBSLinter.lintText(formattedText);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', () => {
        expect(formattedText).toBe(fixture.output);
      });
    });
  }
});
