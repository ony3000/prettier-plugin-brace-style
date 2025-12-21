import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'function declaration (1)',
    input: `
function sum(a, b) {
  return a + b;
}
`,
  },
  {
    name: 'function expression (1)',
    input: `
const sum = function (a, b) {
  return a + b;
}
`,
  },
  {
    name: 'arrow function expression (1)',
    input: `
const sum = (a, b) => {
  return a + b;
}
`,
  },
  {
    name: 'function declaration (2)',
    input: `function foo() {}`,
  },
  {
    name: 'function expression (2)',
    input: `const foo = function () {}`,
  },
  {
    name: 'arrow function expression (2)',
    input: `const foo = () => {}`,
  },
  {
    name: 'anonymous function expression',
    input: `(function () {})`,
  },
  {
    name: 'IIFE (1)',
    input: `(function () {})()`,
  },
  {
    name: 'IIFE (2)',
    input: `(() => {})()`,
  },
  {
    name: 'promise chain',
    input: `myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })`,
  },
  {
    name: 'object literal parameter (1)',
    input: `foo({
  bar,
  baz: 'baz'
})`,
  },
  {
    name: 'object literal parameter (2)',
    input: `foo(bar, {
  baz: 'baz'
})`,
  },
  {
    name: 'object literal parameter (3)',
    input: `foo({bar: 'bar'}, {
  baz: 'baz'
})`,
  },
  {
    name: 'function that returns object literal (1)',
    input: `function foo() { return {} }`,
  },
  {
    name: 'function that returns object literal (2)',
    input: `function foo() { return { foo: 'bar' } }`,
  },
  {
    name: 'function that returns object literal (3)',
    input: `function foo() {
  return {
    foo: 'bar',
    baz,
  }
}`,
  },
  {
    name: 'arrow function that returns object literal (1)',
    input: `const foo = () => ({})`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `const foo = () => ({ foo: 'bar' })`,
  },
  {
    name: 'arrow function that returns object literal (3)',
    input: `const foo = () => ({
  foo: 'bar',
  baz,
})`,
  },
];
