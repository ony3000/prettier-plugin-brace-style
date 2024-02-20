import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'function declaration (1)',
    input: `
<script setup lang="ts">
function sum(a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
function sum(a, b) {
  return a + b;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function sum(a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function sum(a, b) {
          return a + b;
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
    name: 'function expression (1)',
    input: `
<script setup lang="ts">
const sum = function (a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const sum = function (a, b) {
  return a + b;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const sum = function (a, b) {
  return a + b;
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const sum = function (a, b) {
          return a + b;
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
    name: 'arrow function expression (1)',
    input: `
<script setup lang="ts">
const sum = (a, b) => {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const sum = (a, b) => {
  return a + b;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const sum = (a, b) => {
  return a + b;
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const sum = (a, b) => {
          return a + b;
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
    name: 'function declaration (2)',
    input: `
<script setup lang="ts">
function foo(/* args here */) {
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo(/* args here */) {
  statement;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo(/* args here */) {
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo(/* args here */) {
          statement;
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
    name: 'function declaration (3)',
    input: `
<script setup lang="ts">
function foo(
  /* args here */
) {
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo(
  /* args here */
) {
  statement;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {
/* args here */
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {
        /* args here */
          statement;
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
    name: 'function declaration (4)',
    input: `
<script setup lang="ts">
function foo(
  // args here
) {
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo(
  // args here
) {
  statement;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {
// args here
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {
        // args here
          statement;
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
    name: 'function declaration (5)',
    input: `
<script setup lang="ts">
function foo(/* arg */ // arg
  // arg
/* arg */) {
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo(/* arg */ // arg
  // arg
/* arg */) {
  statement;
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo /* arg */() { // arg
// arg
/* arg */
  statement;
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo /* arg */() { // arg
        // arg
        /* arg */
          statement;
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
    name: 'function declaration (6)',
    input: `
<script setup lang="ts">
function foo() {}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo() {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (7)',
    input: `
<script setup lang="ts">
function /*comment1*/ foo() {}
</script>

<template>
  <button
    type="button"
    @click="() => {
function /*comment1*/ foo() {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function /*comment1*/ foo() {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function /*comment1*/ foo() {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (8)',
    input: `
<script setup lang="ts">
function
/*comment2*/
foo() {}
</script>

<template>
  <button
    type="button"
    @click="() => {
function
/*comment2*/
foo() {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function /*comment2*/
foo() {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function /*comment2*/
        foo() {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (9)',
    input: `
<script setup lang="ts">
function foo(/*comment3*/) {}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo(/*comment3*/) {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo(/*comment3*/) {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo(/*comment3*/) {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (10)',
    input: `
<script setup lang="ts">
function foo() /*comment4*/ {}
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo() /*comment4*/ {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() /*comment4*/ {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() /*comment4*/ {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function declaration (11)',
    input: `
<script setup lang="ts">
function foo() {} /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo() {} /*comment5*/
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {} /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {} /*comment5*/
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (2)',
    input: `
<script setup lang="ts">
const foo = function () {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function () {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function () {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function () {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (3)',
    input: `
<script setup lang="ts">
const foo = function /*comment1*/ () {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function /*comment1*/ () {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function () /*comment1*/ {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function () /*comment1*/ {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (4)',
    input: `
<script setup lang="ts">
const foo = function (/*comment2*/) {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function (/*comment2*/) {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function (/*comment2*/) {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function (/*comment2*/) {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (5)',
    input: `
<script setup lang="ts">
const foo = function () /*comment3*/ {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function () /*comment3*/ {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function () /*comment3*/ {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function () /*comment3*/ {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (6)',
    input: `
<script setup lang="ts">
const foo = function ()
/*comment4*/
{}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function ()
/*comment4*/
{}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function () /*comment4*/
{};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function () /*comment4*/
        {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'function expression (7)',
    input: `
<script setup lang="ts">
const foo = function () {} /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = function () {} /*comment5*/
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = function () {}; /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = function () {}; /*comment5*/
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (2)',
    input: `
<script setup lang="ts">
const foo = () => {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (3)',
    input: `
<script setup lang="ts">
const foo = (/*comment1*/) => {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = (/*comment1*/) => {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = (/*comment1*/) => {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = (/*comment1*/) => {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (4)',
    input: `
<script setup lang="ts">
const foo = () /*comment2*/ => {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () /*comment2*/ => {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () /*comment2*/ => {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () /*comment2*/ => {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (5)',
    input: `
<script setup lang="ts">
const foo = () => /*comment3*/ {}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => /*comment3*/ {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => /*comment3*/ {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => /*comment3*/ {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (6)',
    input: `
<script setup lang="ts">
const foo = () =>
/*comment4*/
{}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () =>
/*comment4*/
{}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () =>
  /*comment4*/
  {};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () =>
          /*comment4*/
          {};
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function expression (7)',
    input: `
<script setup lang="ts">
const foo = () => {} /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => {} /*comment5*/
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => {}; /*comment5*/
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => {}; /*comment5*/
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'anonymous function expression',
    input: `
<script setup lang="ts">
(function () {})
</script>

<template>
  <button
    type="button"
    @click="() => {
(function () {})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
(function () {});
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        (function () {});
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'IIFE (1)',
    input: `
<script setup lang="ts">
(function () {})()
</script>

<template>
  <button
    type="button"
    @click="() => {
(function () {})()
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
(function () {})();
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        (function () {})();
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'IIFE (2)',
    input: `
<script setup lang="ts">
(() => {})()
</script>

<template>
  <button
    type="button"
    @click="() => {
(() => {})()
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
(() => {})();
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        (() => {})();
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'promise chain',
    input: `
<script setup lang="ts">
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
</script>

<template>
  <button
    type="button"
    @click="() => {
myPromise.then((value) => { console.log(value) }).catch((err) => { console.error(err) })
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
myPromise
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error(err);
  });
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        myPromise
          .then((value) => {
            console.log(value);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (1)',
    input: `
<script setup lang="ts">
foo({
  bar,
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    @click="() => {
foo({
  bar,
  baz: 'baz'
})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
foo({
  bar,
  baz: "baz",
});
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        foo({
          bar,
          baz: 'baz',
        });
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (2)',
    input: `
<script setup lang="ts">
foo(bar, {
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    @click="() => {
foo(bar, {
  baz: 'baz'
})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
foo(bar, {
  baz: "baz",
});
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        foo(bar, {
          baz: 'baz',
        });
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'object literal parameter (3)',
    input: `
<script setup lang="ts">
foo({bar: 'bar'}, {
  baz: 'baz'
})
</script>

<template>
  <button
    type="button"
    @click="() => {
foo({bar: 'bar'}, {
  baz: 'baz'
})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
foo(
  { bar: "bar" },
  {
    baz: "baz",
  },
);
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        foo(
          { bar: 'bar' },
          {
            baz: 'baz',
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
  {
    name: 'function that returns object literal (1)',
    input: `
<script setup lang="ts">
function foo() { return {} }
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo() { return {} }
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {
  return {};
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {
          return {};
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
    name: 'function that returns object literal (2)',
    input: `
<script setup lang="ts">
function foo() { return { foo: 'bar' } }
</script>

<template>
  <button
    type="button"
    @click="() => {
function foo() { return { foo: 'bar' } }
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {
  return { foo: "bar" };
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {
          return { foo: 'bar' };
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
    name: 'function that returns object literal (3)',
    input: `
<script setup lang="ts">
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
    @click="() => {
function foo() {
  return {
    foo: 'bar',
    baz,
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
function foo() {
  return {
    foo: "bar",
    baz,
  };
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        function foo() {
          return {
            foo: 'bar',
            baz,
          };
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
    name: 'arrow function that returns object literal (1)',
    input: `
<script setup lang="ts">
const foo = () => ({})
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => ({})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => ({});
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => ({});
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function that returns object literal (2)',
    input: `
<script setup lang="ts">
const foo = () => ({ foo: 'bar' })
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => ({ foo: 'bar' })
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => ({ foo: "bar" });
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => ({ foo: 'bar' });
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'arrow function that returns object literal (3)',
    input: `
<script setup lang="ts">
const foo = () => ({
  foo: 'bar',
  baz,
})
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = () => ({
  foo: 'bar',
  baz,
})
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = () => ({
  foo: "bar",
  baz,
});
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = () => ({
          foo: 'bar',
          baz,
        });
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/function/stroustrup', () => {
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
