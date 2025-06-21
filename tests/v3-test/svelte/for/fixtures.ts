import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'for',
    input: `
<script lang="ts">
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for...in',
    input: `
<script lang="ts">
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for...of',
    input: `
<script lang="ts">
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for await...of',
    input: `
<script lang="ts">
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
</script>

<template>
  <button
    type="button"
    on:click={() => {
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
