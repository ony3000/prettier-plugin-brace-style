import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment',
    input: `
<script lang="ts">
const foo = {
  bar: {}
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
const foo = {
  bar: {}
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment with default value',
    input: `
<script lang="ts">
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
</script>

<template>
  <button
    type="button"
    on:click={() => {
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
<script lang="ts">
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (2) - static things',
    input: `
<script lang="ts">
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'for',
    input: `
<script lang="ts">
for (let i = 0; i < 9; i++) {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
for (let i = 0; i < 9; i++) {}
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
if (foo) {}
else if (baz) {}
else {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
if (foo) {}
else if (baz) {}
else {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'labeled block',
    input: `
<script lang="ts">
foo: {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
foo: {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'switch (1)',
    input: `
<script lang="ts">
switch (expr) {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
switch (expr) {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
<script lang="ts">
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
</script>

<template>
  <button
    type="button"
    on:click={() => {
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
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
try {}
catch (ex) {}
finally {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
try {}
catch (ex) {}
finally {}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'while',
    input: `
<script lang="ts">
while (n < 3) {}
</script>

<template>
  <button
    type="button"
    on:click={() => {
while (n < 3) {}
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
do {} while (i < 5);
</script>

<template>
  <button
    type="button"
    on:click={() => {
do {} while (i < 5);
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
