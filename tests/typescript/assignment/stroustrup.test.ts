import { describe, expect, test } from 'vitest';

import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'empty object assignment',
    input: `const foo = {}`,
    output: `const foo = {};
`,
  },
  {
    name: 'object assignment #1',
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
    name: 'object assignment #1 with comment #1',
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
    name: 'object assignment #1 with comment #2',
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
    name: 'object assignment #1 with comment #3',
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
    name: 'object assignment #1 with comment #4',
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
    name: 'object assignment #1 with comment #5',
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
    name: 'object assignment #2',
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
    name: 'object assignment #2 with comment #1',
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
    name: 'object assignment #2 with comment #2',
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
    name: 'object assignment #2 with comment #3',
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
    name: 'object assignment #2 with comment #4',
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
    name: 'conditional assignment #1',
    input: `const foo = true && {
  bar: 'baz'
}`,
    output: `const foo = true && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment #1 with comment #1',
    input: `const foo =/*comment1*/true && {
  bar: 'baz'
}`,
    output: `const foo = /*comment1*/ true && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment #1 with comment #2',
    input: `const foo = true/*comment2*/&& {
  bar: 'baz'
}`,
    output: `const foo = true /*comment2*/ && {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment #1 with comment #3',
    input: `const foo = true &&/*comment3*/{
  bar: 'baz'
}`,
    output: `const foo = true && /*comment3*/ {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment #1 with comment #4',
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
    name: 'conditional assignment #2',
    input: `const foo = false || {
  bar: 'baz'
}`,
    output: `const foo = false || {
  bar: "baz",
};
`,
  },
  {
    name: 'conditional assignment #3',
    input: `const foo = null ?? {
  bar: 'baz'
}`,
    output: `const foo = null ?? {
  bar: "baz",
};
`,
  },
  {
    name: 'destructuring assignment #1',
    input: `const {foo, bar: {baz}} = {}`,
    output: `const {
  foo,
  bar: { baz },
} = {};
`,
  },
  {
    name: 'destructuring assignment #2',
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
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
