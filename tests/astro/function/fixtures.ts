import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'function declaration (1)',
    input: `
---
function sum(a, b) {
  return a + b;
}
---

<script>
function sum(a, b) {
  return a + b;
}
</script>
`,
  },
  {
    name: 'function expression (1)',
    input: `
---
const sum = function (a, b) {
  return a + b;
}
---

<script>
const sum = function (a, b) {
  return a + b;
}
</script>
`,
  },
  {
    name: 'arrow function expression (1)',
    input: `
---
const sum = (a, b) => {
  return a + b;
}
---

<script>
const sum = (a, b) => {
  return a + b;
}
</script>
`,
  },
  {
    name: 'function declaration (2)',
    input: `
---
function foo() {}
---

<script>
function foo() {}
</script>
`,
  },
  {
    name: 'function expression (2)',
    input: `
---
const foo = function () {}
---

<script>
const foo = function () {}
</script>
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `
---
const foo = () => {}
---

<script>
const foo = () => {}
</script>
`,
  },
  {
    name: 'anonymous function expression',
    input: `
---
(function () {})
---

<script>
(function () {})
</script>
`,
  },
  {
    name: 'IIFE (1)',
    input: `
---
(function () {})()
---

<script>
(function () {})()
</script>
`,
  },
  {
    name: 'IIFE (2)',
    input: `
---
(() => {})()
---

<script>
(() => {})()
</script>
`,
  },
  {
    name: 'promise chain',
    input: `
---
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
---

<script>
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
</script>
`,
  },
  {
    name: 'object literal parameter (1)',
    input: `
---
foo({
  bar,
  baz: 'baz'
})
---

<script>
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
---
foo(bar, {
  baz: 'baz'
})
---

<script>
foo(bar, {
  baz: 'baz'
})
</script>
`,
  },
  {
    name: 'object literal parameter (3)',
    input: `
---
foo({bar: 'bar'}, {
  baz: 'baz'
})
---

<script>
foo({bar: 'bar'}, {
  baz: 'baz'
})
</script>
`,
  },
  {
    name: 'function that returns object literal (1)',
    input: `
---
function foo() { return {} }
---

<script>
function foo() { return {} }
</script>
`,
  },
  {
    name: 'function that returns object literal (2)',
    input: `
---
function foo() { return { foo: 'bar' } }
---

<script>
function foo() { return { foo: 'bar' } }
</script>
`,
  },
  {
    name: 'function that returns object literal (3)',
    input: `
---
function foo() {
  return {
    foo: 'bar',
    baz,
  }
}
---

<script>
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
---
const foo = () => ({})
---

<script>
const foo = () => ({})
</script>
`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `
---
const foo = () => ({ foo: 'bar' })
---

<script>
const foo = () => ({ foo: 'bar' })
</script>
`,
  },
  {
    name: 'arrow function that returns object literal (3)',
    input: `
---
const foo = () => ({
  foo: 'bar',
  baz,
})
---

<script>
const foo = () => ({
  foo: 'bar',
  baz,
})
</script>
`,
  },
];
