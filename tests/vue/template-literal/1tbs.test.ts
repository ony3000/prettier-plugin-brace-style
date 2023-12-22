import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal',
input: `
<script setup lang="ts">
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
</script>

<template>
  <button
    type="button"
    @click="() => {
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`;
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`;
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'nested template literal',
input: `
<script setup lang="ts">
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
</script>

<template>
  <button
    type="button"
    @click="() => {
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
    }"
  >
    Click Me
  </button>
</template>
`,
output: `<script setup lang="ts">
const x = \`foo: \${
  1 +
  (function () {
    return 2;
  })() +
  3
}\`;
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const x = \`foo: \${
          1 +
          (function () {
            return 2;
          })() +
          3
        }\`;
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/template-literal/1tbs', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
