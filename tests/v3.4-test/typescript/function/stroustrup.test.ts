import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'typescript',
  braceStyle: 'stroustrup',
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
    input: `function foo() {}`,
    output: `function foo() {}
`,
  },
  {
    name: 'function expression (2)',
    input: `const foo = function () {}`,
    output: `const foo = function () {};
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `const foo = () => {}`,
    output: `const foo = () => {};
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

describe('typescript/function/stroustrup', () => {
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
