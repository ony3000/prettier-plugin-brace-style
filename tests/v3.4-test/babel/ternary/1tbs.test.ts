import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { oneTBSLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'babel',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'ternary operator',
    input: `const x = condition ? function foo() {} : function bar() {return 0;}`,
    output: `const x = condition
  ? function foo() {}
  : function bar() {
      return 0;
    };
`,
  },
  {
    name: 'nested ternary operator',
    input: `const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})`,
    output: `const x = condition1
  ? condition2
    ? function foo() {}
    : function bar() {
        return 0;
      }
  : condition3
  ? function baz() {}
  : function qux() {
      return 0;
    };
`,
  },
];

describe('babel/ternary/1tbs', () => {
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
