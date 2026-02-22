import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'overview',
    input: `
// Variables
@link-color:        #428bca; // sea blue
@link-color-hover:  darken(@link-color, 10%);

// Usage
a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}
`,
  },
  {
    name: 'variable interpolation',
    input: `
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
`,
  },
  {
    name: 'variable variables',
    input: `
@primary:  green;
@secondary: blue;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}
`,
  },
  {
    name: 'lazy evaluation',
    input: `
.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;
`,
  },
  {
    name: 'properties as variables',
    input: `
.widget {
  color: #efefef;
  background-color: $color;
}
`,
  },
];
