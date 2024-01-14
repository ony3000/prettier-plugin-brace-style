import { describe, expect, test } from 'vitest';
import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'empty object assignment',
    input: `
<script setup lang="ts">
const foo = {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1',
    input: `
<script setup lang="ts">
const foo = {
  bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar: {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar: {
    baz: "baz",
  },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar: {
            baz: 'baz',
          },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1 with comment #1',
    input: `
<script setup lang="ts">
const foo = /*comment1*/ {
  bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = /*comment1*/ {
  bar: {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = /*comment1*/ {
  bar: {
    baz: "baz",
  },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = /*comment1*/ {
          bar: {
            baz: 'baz',
          },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1 with comment #2',
    input: `
<script setup lang="ts">
const foo =
/*comment2*/
{
  bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo =
/*comment2*/
{
  bar: {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo =
  /*comment2*/
  {
    bar: {
      baz: "baz",
    },
  };
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo =
          /*comment2*/
          {
            bar: {
              baz: 'baz',
            },
          };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1 with comment #3',
    input: `
<script setup lang="ts">
const foo = {
  /*comment3*/ bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  /*comment3*/ bar: {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  /*comment3*/ bar: {
    baz: "baz",
  },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          /*comment3*/ bar: {
            baz: 'baz',
          },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1 with comment #4',
    input: `
<script setup lang="ts">
const foo = {
  bar: /*comment4*/ {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar: /*comment4*/ {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar: /*comment4*/ {
    baz: "baz",
  },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar: /*comment4*/ {
            baz: 'baz',
          },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #1 with comment #5',
    input: `
<script setup lang="ts">
const foo = {
  bar:
  /*comment5*/
  {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar:
  /*comment5*/
  {
    baz: 'baz'
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar:
    /*comment5*/
    {
      baz: "baz",
    },
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar:
            /*comment5*/
            {
              baz: 'baz',
            },
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #2',
    input: `
<script setup lang="ts">
const foo = {
  bar() {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar() {},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>

`,
    output: `<script setup lang="ts">
const foo = {
  bar() {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar() {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #2 with comment #1',
    input: `
<script setup lang="ts">
const foo = {
  bar/*comment1*/() {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar/*comment1*/() {},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar /*comment1*/() {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar /*comment1*/() {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #2 with comment #2',
    input: `
<script setup lang="ts">
const foo = {
  bar(/*comment2*/) {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar(/*comment2*/) {},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar(/*comment2*/) {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar(/*comment2*/) {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #2 with comment #3',
    input: `
<script setup lang="ts">
const foo = {
  bar()/*comment3*/{},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar()/*comment3*/{},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar() /*comment3*/ {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar() /*comment3*/ {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment #2 with comment #4',
    input: `
<script setup lang="ts">
const foo = {
  bar()
  /*comment4*/
  {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar()
  /*comment4*/
  {},
  ['baz']() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar() /*comment4*/
  {},
  ["baz"]() {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar() /*comment4*/
          {},
          ['baz']() {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #1',
    input: `
<script setup lang="ts">
const foo = true && {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = true && {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = true && {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = true && {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #1 with comment #1',
    input: `
<script setup lang="ts">
const foo =/*comment1*/true && {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo =/*comment1*/true && {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = /*comment1*/ true && {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = /*comment1*/ true && {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #1 with comment #2',
    input: `
<script setup lang="ts">
const foo = true/*comment2*/&& {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = true/*comment2*/&& {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = true /*comment2*/ && {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = true /*comment2*/ && {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #1 with comment #3',
    input: `
<script setup lang="ts">
const foo = true &&/*comment3*/{
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = true &&/*comment3*/{
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = true && /*comment3*/ {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = true && /*comment3*/ {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #1 with comment #4',
    input: `
<script setup lang="ts">
const foo = true &&
/*comment4*/
{
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = true &&
/*comment4*/
{
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = true && /*comment4*/
{
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = true && /*comment4*/
        {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #2',
    input: `
<script setup lang="ts">
const foo = false || {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = false || {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = false || {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = false || {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment #3',
    input: `
<script setup lang="ts">
const foo = null ?? {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = null ?? {
  bar: 'baz'
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = null ?? {
  bar: "baz",
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = null ?? {
          bar: 'baz',
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment #1',
    input: `
<script setup lang="ts">
const {foo, bar: {baz}} = {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const {foo, bar: {baz}} = {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const {
  foo,
  bar: { baz },
} = {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const {
          foo,
          bar: { baz },
        } = {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment #2',
    input: `
<script setup lang="ts">
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>

<template>
  <button
    type="button"
    @click="() => {
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
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

<template>
  <button
    type="button"
    @click="
      () => {
        arr.forEach(
          ({
            data: {
              message: { errors },
            },
          }) => {
            // code
          },
        );
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/assignment/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
