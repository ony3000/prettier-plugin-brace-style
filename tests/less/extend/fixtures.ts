import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}
`,
  },
  {
    name: 'extend syntax',
    input: `
.a:extend(.b) {}

// the above block does the same thing as the below block
.a {
  &:extend(.b);
}
`,
  },
  {
    name: 'extend attached to selector',
    input: `
.big-division,
.big-bag:extend(.bag),
.big-bucket:extend(.bucket) {
  // body
}
`,
  },
  {
    name: 'extend inside ruleset',
    input: `
pre:hover,
.some-class {
  &:extend(div pre);
}
`,
  },
  {
    name: 'extending nested selectors',
    input: `
.bucket {
  tr { // nested ruleset with target selector
    color: blue;
  }
}
.some-class:extend(.bucket tr) {} // nested ruleset is recognized
`,
  },
  {
    name: 'exact matching with extend',
    input: `
.a.class,
.class.a,
.class > .a {
  color: blue;
}
.test:extend(.class) {} // this will NOT match the any selectors above
`,
  },
  {
    name: 'nth expression',
    input: `
:nth-child(1n+3) {
  color: blue;
}
.child:extend(:nth-child(n+3)) {}

[title=identifier] {
  color: blue;
}
[title='identifier'] {
  color: blue;
}
[title="identifier"] {
  color: blue;
}

.noQuote:extend([title=identifier]) {}
.singleQuote:extend([title='identifier']) {}
.doubleQuote:extend([title="identifier"]) {}
`,
  },
  {
    name: 'extend "all"',
    input: `
.a.b.test,
.test.c {
  color: orange;
}
.test {
  &:hover {
    color: green;
  }
}

.replacement:extend(.test all) {}
`,
  },
  {
    name: 'selector interpolation with extend',
    input: `
.bucket {
  color: blue;
}
@{variable}:extend(.bucket) {}
@variable: .selector;
`,
  },
  {
    name: 'scoping / extend inside @media',
    input: `
@media print {
  .screenClass:extend(.selector) {} // extend inside media
  .selector { // this will be matched - it is in the same media
    color: black;
  }
}
.selector { // ruleset on top of style sheet - extend ignores it
  color: red;
}
@media screen {
  .selector {  // ruleset inside another media - extend ignores it
    color: blue;
  }
}
`,
  },
  {
    name: 'duplication detection',
    input: `
.alert-info,
.widget {
  /* declarations */
}

.alert:extend(.alert-info, .widget) {}
`,
  },
];
