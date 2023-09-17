import type { Fixture } from '../../settings';
import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'class declaration (empty body)',
    input: `
class Foo {}
`,
    output: `class Foo
{}
`,
  },
  {
    name: 'class declaration',
    input: `
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
}
`,
    output: `class Rectangle
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
`,
  },
  {
    name: 'class expression',
    input: `
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  area() {
    return this.height * this.width;
  }
};
`,
    output: `const Rectangle = class
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
`,
  },
  {
    name: 'class declaration (with getter/setter)',
    input: `
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
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

}
`,
    output: `class User
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
`,
  },
  {
    name: 'class declaration (with static things)',
    input: `
class ClassWithStaticMethod {
  static staticProperty = 'someValue';
  static staticMethod() {
    return 'static method has been called.';
  }
  static {
    console.log('Class static initialization block called');
  }
}
`,
    output: `class ClassWithStaticMethod
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
`,
  },
];

describe('babel/class/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      // @ts-ignore
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
