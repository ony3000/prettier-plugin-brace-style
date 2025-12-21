import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
    input: `
<script setup lang="ts">
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
    @click="() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }"
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
<script setup lang="ts">
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
    @click="() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }"
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
<script setup lang="ts">
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
    @click="() => {
if (foo) {
  bar();
}
else {
  baz();
}
    }"
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
