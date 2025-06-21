import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'try...catch',
    input: `
<script lang="ts">
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'try...finally',
    input: `
<script lang="ts">
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'try...catch...finally',
    input: `
<script lang="ts">
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'nested try',
    input: `
<script lang="ts">
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
