import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'class declaration (1) - empty body',
    input: `
---
class Foo {}
---

<script>
class Foo {}
</script>
`,
    output: `---
class Foo
{}
---

<script>
  class Foo
  {}
</script>
`,
  },
  {
    name: 'class declaration (2)',
    input: `
---
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
---

<script>
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
`,
    output: `---
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
---

<script>
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
`,
  },
  {
    name: 'class expression',
    input: `
---
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
---

<script>
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
`,
    output: `---
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
---

<script>
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
`,
  },
  {
    name: 'class declaration (3) - with getter/setter',
    input: `
---
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
---

<script>
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
`,
    output: `---
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
---

<script>
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
`,
  },
  {
    name: 'class declaration (4) - with static things',
    input: `
---
class ClassWithStaticMethod {
  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }
  static {
    console.log('Class static initialization block called');
  }
}
---

<script>
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
`,
    output: `---
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
---

<script>
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
`,
  },
];

describe('astro/class/allman', () => {
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
