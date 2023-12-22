import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'for',
input: `
<script setup lang="ts">
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
</script>

<template>
  <button
    type="button"
    @click="() => {
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        for (let i = 0; i < 9; i++) {
          console.log(i);
          // more statements
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for...in',
input: `
<script setup lang="ts">
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const obj = { a: 1, b: 2, c: 3 };

        for (const prop in obj) {
          console.log(\`\${prop}: \${obj[prop]}\`);
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for...of',
input: `
<script setup lang="ts">
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const array1 = ['a', 'b', 'c'];

        for (const element of array1) {
          console.log(element);
        }
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for await...of',
input: `
<script setup lang="ts">
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
    @click="() => {
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
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
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
    @click="
      () => {
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
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/for/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
