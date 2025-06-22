import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'class declaration (1) - empty body',
    input: `
<script setup lang="ts">
class Foo {}
</script>

<template>
  <button
    type="button"
    @click="() => {
class Foo {}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class Foo
{}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        class Foo
        {}
      }
    "
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (2)',
    input: `
<script setup lang="ts">
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class Rectangle
{
  constructor(height, width)
  {
    this.height = height;
    this.width = width;
  }
  area()
  {
    return this.height * this.width;
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        class Rectangle
        {
          constructor(height, width)
          {
            this.height = height;
            this.width = width;
          }
          area()
          {
            return this.height * this.width;
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
    name: 'class expression',
    input: `
<script setup lang="ts">
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
</script>

<template>
  <button
    type="button"
    @click="() => {
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
const Rectangle = class
{
  constructor(height, width)
  {
    this.height = height;
    this.width = width;
  }
  area()
  {
    return this.height * this.width;
  }
};
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        const Rectangle = class
        {
          constructor(height, width)
          {
            this.height = height;
            this.width = width;
          }
          area()
          {
            return this.height * this.width;
          }
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
    name: 'class declaration (3) - with getter/setter',
    input: `
<script setup lang="ts">
class User {

  constructor(name) {
    // invokes the setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      alert('Name is too short.');
      return;
    }
    this._name = value;
  }

}
</script>

<template>
  <button
    type="button"
    @click="() => {
class User {

  constructor(name) {
    // invokes the setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      alert('Name is too short.');
      return;
    }
    this._name = value;
  }

}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class User
{
  constructor(name)
  {
    // invokes the setter
    this.name = name;
  }

  get name()
  {
    return this._name;
  }

  set name(value)
  {
    if (value.length < 4)
    {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        class User
        {
          constructor(name)
          {
            // invokes the setter
            this.name = name;
          }

          get name()
          {
            return this._name;
          }

          set name(value)
          {
            if (value.length < 4)
            {
              alert('Name is too short.');
              return;
            }
            this._name = value;
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
    name: 'class declaration (4) - with static things',
    input: `
<script setup lang="ts">
class ClassWithStaticMethod {
  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }
  static {
    console.log('Class static initialization block called');
  }
}
</script>

<template>
  <button
    type="button"
    @click="() => {
class ClassWithStaticMethod {
  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }
  static {
    console.log('Class static initialization block called');
  }
}
    }"
  >
    Click Me
  </button>
</template>
`,
    output: `<script setup lang="ts">
class ClassWithStaticMethod
{
  static staticProperty = "someValue";
  static staticMethod()
  {
    return "static method has been called.";
  }
  static
  {
    console.log("Class static initialization block called");
  }
}
</script>

<template>
  <button
    type="button"
    @click="
      () =>
      {
        class ClassWithStaticMethod
        {
          static staticProperty = 'someValue';
          static staticMethod()
          {
            return 'static method has been called.';
          }
          static
          {
            console.log('Class static initialization block called');
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
];

describe('vue/class/allman', () => {
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
