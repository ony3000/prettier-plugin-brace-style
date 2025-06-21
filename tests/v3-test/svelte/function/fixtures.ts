import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'function declaration (1)',
    input: `
<script lang="ts">
function sum(a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
function sum(a, b) {
  return a + b;
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (1)',
    input: `
<script lang="ts">
const sum = function (a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const sum = function (a, b) {
  return a + b;
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (1)',
    input: `
<script lang="ts">
const sum = (a, b) => {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const sum = (a, b) => {
  return a + b;
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (2)',
    input: `
<script lang="ts">
function foo() {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
function foo() {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (2)',
    input: `
<script lang="ts">
const foo = function () {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = function () {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `
<script lang="ts">
const foo = () => {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = () => {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'anonymous function expression',
    input: `
<script lang="ts">
(function () {})
</script>

<template>
  <button
    type="button"
    on:click={() => {
(function () {})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'IIFE (1)',
    input: `
<script lang="ts">
(function () {})()
</script>

<template>
  <button
    type="button"
    on:click={() => {
(function () {})()
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'IIFE (2)',
    input: `
<script lang="ts">
(() => {})()
</script>

<template>
  <button
    type="button"
    on:click={() => {
(() => {})()
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'promise chain',
    input: `
<script lang="ts">
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
</script>

<template>
  <button
    type="button"
    on:click={() => {
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (1)',
    input: `
<script lang="ts">
foo({
  bar,
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    on:click={() => {
foo({
  bar,
  baz: 'baz'
})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (2)',
    input: `
<script lang="ts">
foo(bar, {
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    on:click={() => {
foo(bar, {
  baz: 'baz'
})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (3)',
    input: `
<script lang="ts">
foo({bar: 'bar'}, {
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    on:click={() => {
foo({bar: 'bar'}, {
  baz: 'baz'
})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function that returns object literal (1)',
    input: `
<script lang="ts">
function foo() { return {} }
</script>

<template>
  <button
    type="button"
    on:click={() => {
function foo() { return {} }
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function that returns object literal (2)',
    input: `
<script lang="ts">
function foo() { return { foo: 'bar' } }
</script>

<template>
  <button
    type="button"
    on:click={() => {
function foo() { return { foo: 'bar' } }
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function that returns object literal (3)',
    input: `
<script lang="ts">
function foo() {
  return {
    foo: 'bar',
    baz,
  }
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
function foo() {
  return {
    foo: 'bar',
    baz,
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
    name: 'arrow function that returns object literal (1)',
    input: `
<script lang="ts">
const foo = () => ({})
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = () => ({})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `
<script lang="ts">
const foo = () => ({ foo: 'bar' })
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = () => ({ foo: 'bar' })
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function that returns object literal (3)',
    input: `
<script lang="ts">
const foo = () => ({
  foo: 'bar',
  baz,
})
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = () => ({
  foo: 'bar',
  baz,
})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
