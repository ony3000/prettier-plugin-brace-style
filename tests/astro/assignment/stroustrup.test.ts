import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'object assignment (1)',
    input: `
---
const foo = {}
---

<script>
const foo = {}
</script>
`,
    output: `---
const foo = {};
---

<script>
  const foo = {};
</script>
`,
  },
  {
    name: 'object assignment (2)',
    input: `
---
const foo = {
  bar: {
    baz: 'baz'
  }
}
---

<script>
const foo = {
  bar: {
    baz: 'baz'
  }
}
</script>
`,
    output: `---
const foo = {
  bar: {
    baz: "baz",
  },
};
---

<script>
  const foo = {
    bar: {
      baz: "baz",
    },
  };
</script>
`,
  },
  {
    name: 'object assignment (3)',
    input: `
---
const foo = {
  bar() {},
  ['baz']() {}
}
---

<script>
const foo = {
  bar() {},
  ['baz']() {}
}
</script>

`,
    output: `---
const foo = {
  bar() {},
  ["baz"]() {},
};
---

<script>
  const foo = {
    bar() {},
    ["baz"]() {},
  };
</script>
`,
  },
  {
    name: 'conditional assignment (1)',
    input: `
---
const foo = true && {
  bar: 'baz'
}
---

<script>
const foo = true && {
  bar: 'baz'
}
</script>
`,
    output: `---
const foo = true && {
  bar: "baz",
};
---

<script>
  const foo = true && {
    bar: "baz",
  };
</script>
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `
---
const foo = false || {
  bar: 'baz'
}
---

<script>
const foo = false || {
  bar: 'baz'
}
</script>
`,
    output: `---
const foo = false || {
  bar: "baz",
};
---

<script>
  const foo = false || {
    bar: "baz",
  };
</script>
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `
---
const foo = null ?? {
  bar: 'baz'
}
---

<script>
const foo = null ?? {
  bar: 'baz'
}
</script>
`,
    output: `---
const foo = null ?? {
  bar: "baz",
};
---

<script>
  const foo = null ?? {
    bar: "baz",
  };
</script>
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `
---
const {foo, bar: {baz}} = {}
---

<script>
const {foo, bar: {baz}} = {}
</script>
`,
    output: `---
const {
  foo,
  bar: { baz },
} = {};
---

<script>
  const {
    foo,
    bar: { baz },
  } = {};
</script>
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `
---
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
---

<script>
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>
`,
    output: `---
arr.forEach(
  ({
    data: {
      message: { errors },
    },
  }) => {
    // code
  },
);
---

<script>
  arr.forEach(
    ({
      data: {
        message: { errors },
      },
    }) => {
      // code
    },
  );
</script>
`,
  },
];

describe('astro/assignment/stroustrup', () => {
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
