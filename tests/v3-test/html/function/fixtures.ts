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
`,
  },
  {
    name: 'function declaration (2)',
    input: `
<script lang="ts">
function foo() {}
</script>
`,
  },
  {
    name: 'function expression (2)',
    input: `
<script lang="ts">
const foo = function () {}
</script>
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `
<script lang="ts">
const foo = () => {}
</script>
`,
  },
  {
    name: 'anonymous function expression',
    input: `
<script lang="ts">
(function () {})
</script>
`,
  },
  {
    name: 'IIFE (1)',
    input: `
<script lang="ts">
(function () {})()
</script>
`,
  },
  {
    name: 'IIFE (2)',
    input: `
<script lang="ts">
(() => {})()
</script>
`,
  },
  {
    name: 'promise chain',
    input: `
<script lang="ts">
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
</script>
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
`,
  },
  {
    name: 'function that returns object literal (1)',
    input: `
<script lang="ts">
function foo() { return {} }
</script>
`,
  },
  {
    name: 'function that returns object literal (2)',
    input: `
<script lang="ts">
function foo() { return { foo: 'bar' } }
</script>
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
`,
  },
  {
    name: 'arrow function that returns object literal (1)',
    input: `
<script lang="ts">
const foo = () => ({})
</script>
`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `
<script lang="ts">
const foo = () => ({ foo: 'bar' })
</script>
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
`,
  },
];
