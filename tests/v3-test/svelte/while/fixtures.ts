import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'while',
    input: `
<script lang="ts">
let n = 0;

while (n < 3) {
  n++;
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
let n = 0;

while (n < 3) {
  n++;
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'do...while',
    input: `
<script lang="ts">
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>

<template>
  <button
    type="button"
    on:click={() => {
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
