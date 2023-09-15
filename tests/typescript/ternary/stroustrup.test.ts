import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'stroustrup',
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

describe('typescript/ternary/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
