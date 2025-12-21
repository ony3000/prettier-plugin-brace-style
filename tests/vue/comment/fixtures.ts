import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'single line comment (1)',
    input: `
<script setup lang="ts">
//class Foo {}
</script>

<template>
  <button
    type="button"
    @click="() => {
//class Foo {}
    }"
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `
<script setup lang="ts">
// function foo() {
//   bar;
// }
</script>

<template>
  <button
    type="button"
    @click="() => {
// function foo() {
//   bar;
// }
    }"
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'multi line comment',
    input: `
<script setup lang="ts">
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>

<template>
  <button
    type="button"
    @click="() => {
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
    }"
  >
    Click Me
  </button>
</template>
`,
  },
];
