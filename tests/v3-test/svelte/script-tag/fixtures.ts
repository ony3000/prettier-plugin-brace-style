import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'including TypeScript syntax inside script tag (1) - class',
    input: `
<script lang="ts">
let any: any;

class Foo {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
class Foo {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'including TypeScript syntax inside script tag (2) - for',
    input: `
<script lang="ts">
let any: any;

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
    name: 'including TypeScript syntax inside script tag (3) - function',
    input: `
<script lang="ts">
let any: any;

function sum(a, b) {
  return a + b;
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
function sum(a, b) {
  return a + b;
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'including TypeScript syntax inside script tag (4) - if',
    input: `
<script lang="ts">
let any: any;

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
    name: 'including TypeScript syntax inside script tag (5) - label',
    input: `
<script lang="ts">
let any: any;

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
    on:click={() => {
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'including TypeScript syntax inside script tag (6) - switch',
    input: `
<script lang="ts">
let any: any;

switch (expr) {
  case 'Oranges':
    console.log('Oranges');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
switch (expr) {
  case 'Oranges':
    console.log('Oranges');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas');
    break;
  default:
    console.log(expr);
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'including TypeScript syntax inside script tag (7) - try',
    input: `
<script lang="ts">
let any: any;

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
    name: 'including TypeScript syntax inside script tag (8) - while',
    input: `
<script lang="ts">
let any: any;
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
];
