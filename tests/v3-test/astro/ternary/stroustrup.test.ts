import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
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

describe('astro/ternary/stroustrup', () => {
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
