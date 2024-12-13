import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'object assignment (1)',
    input: `const foo = {}`,
    output: `const foo = {};
`,
  },
  {
    name: 'object assignment (2)',
    input: `const foo = {
  bar: {
    baz: 'baz'
  }
}`,
    output: `const foo = {
  bar: {
    baz: "baz",
  },
};
`,
  },
  {
    name: 'object assignment (3)',
    input: `const foo = {
  bar() {},
  ['baz']() {}
}`,
    output: `const foo = {
  bar() {},
  ["baz"]() {},
};
`,
  },
  {
    name: 'conditional assignment (1)',
    input: `const foo = true && {
  bar: 'baz'
}`,
    output: `const foo = true && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `const foo = false || {
  bar: 'baz'
}`,
    output: `const foo = false || {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `const foo = null ?? {
  bar: 'baz'
}`,
    output: `const foo = null ?? {
  bar: "baz",
};
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `const {foo, bar: {baz}} = {}`,
    output: `const {
  foo,
  bar: { baz },
} = {};
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `try {
  // code
} catch ({ data: { message: { errors }}}) {
  // code
}`,
    output: `try {
  // code
}
catch ({
  data: {
    message: { errors },
  },
}) {
  // code
}
`,
  },
];

describe('typescript/assignment/stroustrup', () => {
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
