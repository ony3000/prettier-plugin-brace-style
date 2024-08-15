import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment (1)',
    input: `
<script lang="ts">
const foo = {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment (2)',
    input: `
<script lang="ts">
const foo = {
  bar: {
    baz: 'baz'
  }
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = {
  bar: {
    baz: 'baz'
  }
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object assignment (3)',
    input: `
<script lang="ts">
const foo = {
  bar() {},
  ['baz']() {}
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = {
  bar() {},
  ['baz']() {}
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (1)',
    input: `
<script lang="ts">
const foo = true && {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = true && {
  bar: 'baz'
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `
<script lang="ts">
const foo = false || {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = false || {
  bar: 'baz'
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `
<script lang="ts">
const foo = null ?? {
  bar: 'baz'
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = null ?? {
  bar: 'baz'
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `
<script lang="ts">
const {foo, bar: {baz}} = {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const {foo, bar: {baz}} = {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `
<script lang="ts">
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>

<template>
  <button
    type="button"
    on:click={() => {
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
