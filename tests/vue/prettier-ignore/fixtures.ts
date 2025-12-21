import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `
<script setup lang="ts">
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="() => {
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'ignore comment (2)',
    input: `
<script setup lang="ts">
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<template>
  <button
    type="button"
    @click="() => {
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'ignore comment (3)',
    input: `
<!-- prettier-ignore -->
<template>
  <div>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
  </div>
</template>
`,
  },
  {
    name: 'ignore comment (4)',
    input: `
<template>
  <div>
    <!-- prettier-ignore -->
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
    <button
      type="button"
      @click="() => {
        console.log('click')
      }"
    >
      Click Me
    </button>
  </div>
</template>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
<script setup lang="ts">
/**
 * prettier-ignore
 */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<!--
 ! prettier-ignore
-->
<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
<script setup lang="ts">
// /* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>

<!-- /* prettier-ignore */ -->
<template>
  <button
    type="button"
    @click="() => {
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
    }"
  >
    Click Me
  </button>
</template>
`,
  },
];
