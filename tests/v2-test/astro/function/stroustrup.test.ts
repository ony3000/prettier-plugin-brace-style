import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
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
    output: `---
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
    output: `---
const sum = function (a, b) {
  return a + b;
};
---

<script>
  const sum = function (a, b) {
    return a + b;
  };
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
    output: `---
const sum = (a, b) => {
  return a + b;
};
---

<script>
  const sum = (a, b) => {
    return a + b;
  };
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
    output: `---
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
    output: `---
const foo = function () {};
---

<script>
  const foo = function () {};
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
    output: `---
const foo = () => {};
---

<script>
  const foo = () => {};
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
    output: `---
(function () {});
---

<script>
  (function () {});
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
    output: `---
(function () {})();
---

<script>
  (function () {})();
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
    output: `---
(() => {})();
---

<script>
  (() => {})();
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
    output: `---
myPromise
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error(err);
  });
---

<script>
  myPromise
    .then((value) => {
      console.log(value);
    })
    .catch((err) => {
      console.error(err);
    });
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
    output: `---
foo({
  bar,
  baz: "baz",
});
---

<script>
  foo({
    bar,
    baz: "baz",
  });
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
    output: `---
foo(bar, {
  baz: "baz",
});
---

<script>
  foo(bar, {
    baz: "baz",
  });
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
    output: `---
foo(
  { bar: "bar" },
  {
    baz: "baz",
  },
);
---

<script>
  foo(
    { bar: "bar" },
    {
      baz: "baz",
    },
  );
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
    output: `---
function foo() {
  return {};
}
---

<script>
  function foo() {
    return {};
  }
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
    output: `---
function foo() {
  return { foo: "bar" };
}
---

<script>
  function foo() {
    return { foo: "bar" };
  }
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
    output: `---
function foo() {
  return {
    foo: "bar",
    baz,
  };
}
---

<script>
  function foo() {
    return {
      foo: "bar",
      baz,
    };
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
    output: `---
const foo = () => ({});
---

<script>
  const foo = () => ({});
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
    output: `---
const foo = () => ({ foo: "bar" });
---

<script>
  const foo = () => ({ foo: "bar" });
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
    output: `---
const foo = () => ({
  foo: "bar",
  baz,
});
---

<script>
  const foo = () => ({
    foo: "bar",
    baz,
  });
</script>
`,
  },
];

describe('astro/function/stroustrup', () => {
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
