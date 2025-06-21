import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
    input: `
<script lang="ts">
if (foo) {
  bar();
}
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }}
  >
    Click Me
  </button>
</template>
`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `
<script lang="ts">
if (foo) {
  bar();
}
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }}
  >
    Click Me
  </button>
</template>
`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `
<script lang="ts">
if (foo) {
  bar();
}
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }}
  >
    Click Me
  </button>
</template>
`,
    options: {
      endOfLine: 'crlf',
    },
  },
];
