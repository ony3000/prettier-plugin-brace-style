import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'ternary operator',
    input: `
---
const x = condition ? function foo() {} : function bar() {return 0;}
---

<script>
const x = condition ? function foo() {} : function bar() {return 0;}
</script>
`,
    output: `---
const x = condition
  ? function foo() {}
  : function bar() {
      return 0;
    };
---

<script>
  const x = condition
    ? function foo() {}
    : function bar() {
        return 0;
      };
</script>
`,
  },
  {
    name: 'nested ternary operator',
    input: `
---
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
---

<script>
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
</script>
`,
    output: `---
const x = condition1
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
---

<script>
  const x = condition1
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
</script>
`,
  },
];

describe('astro/ternary/1tbs', () => {
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
