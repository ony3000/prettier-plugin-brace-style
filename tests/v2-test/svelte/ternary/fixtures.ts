import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ternary operator',
    input: `
<script lang="ts">
const x = condition ? function foo() {} : function bar() {return 0;}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const x = condition ? function foo() {} : function bar() {return 0;}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: '🟠 nested ternary operator',
    input: `
<script lang="ts">
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
</script>

<template>
  <button
    type="button"
    on:click={() => {
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
