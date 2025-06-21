import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'if',
    input: `
<script lang="ts">
if (foo)
{
  bar();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo)
{
  bar();
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...else (1)',
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
  },
  {
    name: 'if...elseif...else',
    input: `
<script lang="ts">
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...else (2) - with comment',
    input: `
<script lang="ts">
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
