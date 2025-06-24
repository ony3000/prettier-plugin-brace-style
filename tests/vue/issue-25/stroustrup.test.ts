import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'object assignment',
    input: `
<script setup lang="ts">
const foo = {
  bar: {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
const foo = {
  bar: {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const foo = {
  bar: {},
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const foo = {
          bar: {},
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'destructuring assignment with default value',
    input: `
<script setup lang="ts">
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
</script>

<template>
  <button
    type="button"
    @click="() => {
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const renderComponent = ({ handleSubmit = () => {}, errors }) => {
  return null;
};
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        const renderComponent = ({ handleSubmit = () => {}, errors }) => {
          return null;
        };
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
<script setup lang="ts">
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        class BaseQueue {
          onFlush() {}

          onFlushFail() {}

          onFlushSuccess() {}
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
    name: 'class declaration (2) - static things',
    input: `
<script setup lang="ts">
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        class ClassWithStatic {
          static staticMethod() {}
          static {}
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
    name: 'for',
    input: `
<script setup lang="ts">
for (let i = 0; i < 9; i++) {}
</script>

<template>
  <button
    type="button"
    @click="() => {
for (let i = 0; i < 9; i++) {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
for (let i = 0; i < 9; i++) {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        for (let i = 0; i < 9; i++) {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
<script setup lang="ts">
if (foo) {}
else if (baz) {}
else {}
</script>

<template>
  <button
    type="button"
    @click="() => {
if (foo) {}
else if (baz) {}
else {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
if (foo) {
}
else if (baz) {
}
else {
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        if (foo) {
        }
        else if (baz) {
        }
        else {
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
    name: 'labeled block',
    input: `
<script setup lang="ts">
foo: {}
</script>

<template>
  <button
    type="button"
    @click="() => {
foo: {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
foo: {
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        foo: {
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
    name: 'switch (1)',
    input: `
<script setup lang="ts">
switch (expr) {}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (expr) {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
switch (expr) {
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        switch (expr) {
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
    name: 'switch (2) - case with block',
    input: `
<script setup lang="ts">
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
</script>

<template>
  <button
    type="button"
    @click="() => {
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
switch (action) {
  case "say_hello": {
  }
  case "say_hi": {
  }
  default: {
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        switch (action) {
          case 'say_hello': {
          }
          case 'say_hi': {
          }
          default: {
          }
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
    name: 'try...catch...finally',
    input: `
<script setup lang="ts">
try {}
catch (ex) {}
finally {}
</script>

<template>
  <button
    type="button"
    @click="() => {
try {}
catch (ex) {}
finally {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
try {
}
catch (ex) {
}
finally {
}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        try {
        }
        catch (ex) {
        }
        finally {
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
    name: 'while',
    input: `
<script setup lang="ts">
while (n < 3) {}
</script>

<template>
  <button
    type="button"
    @click="() => {
while (n < 3) {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
while (n < 3) {}
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        while (n < 3) {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'do...while',
    input: `
<script setup lang="ts">
do {} while (i < 5);
</script>

<template>
  <button
    type="button"
    @click="() => {
do {} while (i < 5);
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
do {} while (i < 5);
</script>

<template>
  <button
    type="button"
    @click="
      () => {
        do {} while (i < 5);
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
];

describe('vue/issue-25/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
