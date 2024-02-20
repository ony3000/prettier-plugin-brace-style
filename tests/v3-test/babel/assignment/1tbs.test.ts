import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { oneTBSLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: '1tbs',
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
    input: `const foo = /*comment1*/ {
  bar: {
    baz: 'baz'
  }
}`,
    output: `const foo = /*comment1*/ {
  bar: {
    baz: "baz",
  },
};
`,
  },
  {
    name: 'object assignment (4)',
    input: `const foo =
/*comment2*/
{
  bar: {
    baz: 'baz'
  }
}`,
    output: `const foo =
  /*comment2*/
  {
    bar: {
      baz: "baz",
    },
  };
`,
  },
  {
    name: 'object assignment (5)',
    input: `const foo = {
  /*comment3*/ bar: {
    baz: 'baz'
  }
}`,
    output: `const foo = {
  /*comment3*/ bar: {
    baz: "baz",
  },
};
`,
  },
  {
    name: 'object assignment (6)',
    input: `const foo = {
  bar: /*comment4*/ {
    baz: 'baz'
  }
}`,
    output: `const foo = {
  bar: /*comment4*/ {
    baz: "baz",
  },
};
`,
  },
  {
    name: 'object assignment (7)',
    input: `const foo = {
  bar:
  /*comment5*/
  {
    baz: 'baz'
  }
}`,
    output: `const foo = {
  bar:
    /*comment5*/
    {
      baz: "baz",
    },
};
`,
  },
  {
    name: 'object assignment (8)',
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
    name: 'object assignment (9)',
    input: `const foo = {
  bar/*comment1*/() {},
  ['baz']() {}
}`,
    output: `const foo = {
  bar /*comment1*/() {},
  ["baz"]() {},
};
`,
  },
  {
    name: 'object assignment (10)',
    input: `const foo = {
  bar(/*comment2*/) {},
  ['baz']() {}
}`,
    output: `const foo = {
  bar(/*comment2*/) {},
  ["baz"]() {},
};
`,
  },
  {
    name: 'object assignment (11)',
    input: `const foo = {
  bar()/*comment3*/{},
  ['baz']() {}
}`,
    output: `const foo = {
  bar() /*comment3*/ {},
  ["baz"]() {},
};
`,
  },
  {
    name: 'object assignment (12)',
    input: `const foo = {
  bar()
  /*comment4*/
  {},
  ['baz']() {}
}`,
    output: `const foo = {
  bar() /*comment4*/
  {},
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
    input: `const foo =/*comment1*/true && {
  bar: 'baz'
}`,
    output: `const foo = /*comment1*/ true && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `const foo = true/*comment2*/&& {
  bar: 'baz'
}`,
    output: `const foo = true /*comment2*/ && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (4)',
    input: `const foo = true &&/*comment3*/{
  bar: 'baz'
}`,
    output: `const foo = true && /*comment3*/ {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (5)',
    input: `const foo = true &&
/*comment4*/
{
  bar: 'baz'
}`,
    output: `const foo = true && /*comment4*/
{
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (6)',
    input: `const foo = false || {
  bar: 'baz'
}`,
    output: `const foo = false || {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment (7)',
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
} catch ({
  data: {
    message: { errors },
  },
}) {
  // code
}
`,
  },
];

describe('babel/assignment/1tbs', () => {
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
