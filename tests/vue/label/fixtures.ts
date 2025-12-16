import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'labeled block',
    input: `
<script setup lang="ts">
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
</script>

<template>
  <button
    type="button"
    @click="() => {
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
    }"
  >
    Click Me
  </button>
</template>
`,
  },
];
