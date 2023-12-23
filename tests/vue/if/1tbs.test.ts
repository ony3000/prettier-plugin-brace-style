import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'if',
    input: `
<script setup lang="ts">
if (foo)
{
  bar();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo)
{
  bar();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo) {
  bar();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
          bar();
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...else',
    input: `
<script setup lang="ts">
if (foo) {
  bar();
}
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo) {
  bar();
} else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
          bar();
        } else {
          baz();
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
<script setup lang="ts">
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
          bar();
        } else if (baz) {
          qux();
        } else {
          quux();
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...else (with comment)',
    input: `
<script setup lang="ts">
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="() => {
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        // foo is truthy
        if (foo) {
          bar();
        }
        // foo is falsy
        else {
          baz();
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if (containing only comments in brackets #1)',
    input: `
<script setup lang="ts">
if (condition) {
  // statement
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {
  // statement
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  // statement
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          // statement
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if (containing only comments in brackets #2)',
    input: `
<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {
  /* statement */
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if (containing only comments in brackets #3)',
    input: `
<script setup lang="ts">
if (condition) {/* statement */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {/* statement */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if (containing only comments in brackets #4)',
    input: `
<script setup lang="ts">
if (condition) {/* statement */
  // statement
/* statement */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition) {/* statement */
  // statement
/* statement */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition) {
  /* statement */
  // statement
  /* statement */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition) {
          /* statement */
          // statement
          /* statement */
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...elseif...else (containing only comments in brackets)',
    input: `
<script setup lang="ts">
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition1) {
  /* statement1 */
} else if (condition2) {
  /* statement2 */
} else {
  /* statement3 */
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          /* statement1 */
        } else if (condition2) {
          /* statement2 */
        } else {
          /* statement3 */
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'nested if (containing only comments in brackets)',
    input: `
<script setup lang="ts">
if (condition1) {
  if (condition2) {/* statement */}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  if (condition2) {/* statement */}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (condition1) {
  if (condition2) {
    /* statement */
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (condition1) {
          if (condition2) {
            /* statement */
          }
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/if/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
