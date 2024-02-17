import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'function declaration (1)',
    input: `
function sum(a, b) {
  return a + b;
}
`,
    output: `function sum(a, b) {
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
    output: `const sum = function (a, b) {
  return a + b;
};
`,
  },
  {
    name: 'arrow function expression (1)',
    input: `
const sum = (a, b) => {
  return a + b;
}
`,
    output: `const sum = (a, b) => {
  return a + b;
};
`,
  },
  {
    name: 'function declaration (2)',
    input: `
function foo(/* args here */) {
  statement;
}
`,
    output: `function foo(/* args here */) {
  statement;
}
`,
  },
  {
    name: 'function declaration (3)',
    input: `
function foo(
  /* args here */
) {
  statement;
}
`,
    output: `function foo() {
/* args here */
  statement;
}
`,
  },
  {
    name: 'function declaration (4)',
    input: `
function foo(
  // args here
) {
  statement;
}
`,
    output: `function foo() {
// args here
  statement;
}
`,
  },
  {
    name: 'function declaration (5)',
    input: `
function foo(/* arg */ // arg
  // arg
/* arg */) {
  statement;
}
`,
    output: `function foo /* arg */() { // arg
// arg
/* arg */
  statement;
}
`,
  },
  {
    name: 'function declaration (6)',
    input: `function foo() {}`,
    output: `function foo() {}
`,
  },
  {
    name: 'function declaration (7)',
    input: `function /*comment1*/ foo() {}`,
    output: `function /*comment1*/ foo() {}
`,
  },
  {
    name: 'function declaration (8)',
    input: `function
/*comment2*/
foo() {}`,
    output: `function /*comment2*/
foo() {}
`,
  },
  {
    name: 'function declaration (9)',
    input: `function foo(/*comment3*/) {}`,
    output: `function foo(/*comment3*/) {}
`,
  },
  {
    name: 'function declaration (10)',
    input: `function foo() /*comment4*/ {}`,
    output: `function foo() /*comment4*/ {}
`,
  },
  {
    name: 'function declaration (11)',
    input: `function foo() {} /*comment5*/`,
    output: `function foo() {} /*comment5*/
`,
  },
  {
    name: 'function expression (2)',
    input: `const foo = function () {}`,
    output: `const foo = function () {};
`,
  },
  {
    name: 'function expression (3)',
    input: `const foo = function /*comment1*/ () {}`,
    output: `const foo = function () /*comment1*/ {};
`,
  },
  {
    name: 'function expression (4)',
    input: `const foo = function (/*comment2*/) {}`,
    output: `const foo = function (/*comment2*/) {};
`,
  },
  {
    name: 'function expression (5)',
    input: `const foo = function () /*comment3*/ {}`,
    output: `const foo = function () /*comment3*/ {};
`,
  },
  {
    name: 'function expression (6)',
    input: `const foo = function ()
/*comment4*/
{}`,
    output: `const foo = function () /*comment4*/
{};
`,
  },
  {
    name: 'function expression (7)',
    input: `const foo = function () {} /*comment5*/`,
    output: `const foo = function () {}; /*comment5*/
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `const foo = () => {}`,
    output: `const foo = () => {};
`,
  },
  {
    name: 'arrow function expression (3)',
    input: `const foo = (/*comment1*/) => {}`,
    output: `const foo = (/*comment1*/) => {};
`,
  },
  {
    name: 'arrow function expression (4)',
    input: `const foo = () /*comment2*/ => {}`,
    output: `const foo = () /*comment2*/ => {};
`,
  },
  {
    name: 'arrow function expression (5)',
    input: `const foo = () => /*comment3*/ {}`,
    output: `const foo = () => /*comment3*/ {};
`,
  },
  {
    name: 'arrow function expression (6)',
    input: `const foo = () =>
/*comment4*/
{}`,
    output: `const foo = () =>
  /*comment4*/
  {};
`,
  },
  {
    name: 'arrow function expression (7)',
    input: `const foo = () => {} /*comment5*/`,
    output: `const foo = () => {}; /*comment5*/
`,
  },
  {
    name: 'anonymous function expression',
    input: `(function () {})`,
    output: `(function () {});
`,
  },
  {
    name: 'IIFE (1)',
    input: `(function () {})()`,
    output: `(function () {})();
`,
  },
  {
    name: 'IIFE (2)',
    input: `(() => {})()`,
    output: `(() => {})();
`,
  },
  {
    name: 'promise chain',
    input: `myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })`,
    output: `myPromise
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error(err);
  });
`,
  },
  {
    name: 'object literal parameter (1)',
    input: `foo({
  bar,
  baz: 'baz'
})`,
    output: `foo({
  bar,
  baz: "baz",
});
`,
  },
  {
    name: 'object literal parameter (2)',
    input: `foo(bar, {
  baz: 'baz'
})`,
    output: `foo(bar, {
  baz: "baz",
});
`,
  },
  {
    name: 'object literal parameter (3)',
    input: `foo({bar: 'bar'}, {
  baz: 'baz'
})`,
    output: `foo(
  { bar: "bar" },
  {
    baz: "baz",
  },
);
`,
  },
  {
    name: 'function that returns object literal (1)',
    input: `function foo() { return {} }`,
    output: `function foo() {
  return {};
}
`,
  },
  {
    name: 'function that returns object literal (2)',
    input: `function foo() { return { foo: 'bar' } }`,
    output: `function foo() {
  return { foo: "bar" };
}
`,
  },
  {
    name: 'function that returns object literal (3)',
    input: `function foo() {
  return {
    foo: 'bar',
    baz,
  }
}`,
    output: `function foo() {
  return {
    foo: "bar",
    baz,
  };
}
`,
  },
  {
    name: 'arrow function that returns object literal (1)',
    input: `const foo = () => ({})`,
    output: `const foo = () => ({});
`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `const foo = () => ({ foo: 'bar' })`,
    output: `const foo = () => ({ foo: "bar" });
`,
  },
  {
    name: 'arrow function that returns object literal (3)',
    input: `const foo = () => ({
  foo: 'bar',
  baz,
})`,
    output: `const foo = () => ({
  foo: "bar",
  baz,
});
`,
  },
];

describe('typescript/function/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
