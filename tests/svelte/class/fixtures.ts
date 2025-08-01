import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'class declaration (1) - empty body',
    input: `
<script lang="ts">
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
    name: 'class declaration (2)',
    input: `
<script lang="ts">
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
    on:click={() => {
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class expression',
    input: `
<script lang="ts">
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
    on:click={() => {
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (3) - with getter/setter',
    input: `
<script lang="ts">
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
    on:click={() => {
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
    }}
  >
    Click Me
  </button>
</template>
`,
  },
  {
    name: 'class declaration (4) - with static things',
    input: `
<script lang="ts">
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
    on:click={() => {
class ClassWithStaticMethod {
  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }
  static {
    console.log('Class static initialization block called');
  }
}
    }}
  >
    Click Me
  </button>
</template>
`,
  },
];
