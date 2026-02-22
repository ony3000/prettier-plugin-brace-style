import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: ':active',
    input: `
/* Unvisited links */
a:link {
  color: blue;
}
/* Visited links */
a:visited {
  color: purple;
}
/* Hovered links */
a:hover {
  background: yellow;
}
/* Active links */
a:active {
  color: red;
}

/* Active paragraphs */
p:active {
  background: #eeeeee;
}
`,
  },
  {
    name: ':checked',
    input: `
div,
select {
  margin: 8px;
}

/* Labels for checked inputs */
input:checked + label {
  color: red;
}

/* Radio element, when checked */
input[type="radio"]:checked {
  box-shadow: 0 0 0 3px orange;
}

/* Checkbox element, when checked */
input[type="checkbox"]:checked {
  box-shadow: 0 0 0 3px hotpink;
}

/* Option elements, when selected */
option:checked {
  box-shadow: 0 0 0 3px lime;
  color: red;
}
`,
  },
  {
    name: ':disabled',
    input: `
input[type="text"]:disabled {
  background: #cccccc;
}
`,
  },
  {
    name: ':first-of-type',
    input: `
p:first-of-type {
  color: red;
  font-style: italic;
}
`,
  },
  {
    name: ':focus',
    input: `
.red-input:focus {
  background: yellow;
  color: red;
}

.blue-input:focus {
  background: yellow;
  color: blue;
}
`,
  },
  {
    name: ':has()',
    input: `
section:has(.featured) {
  border: 2px solid blue;
}
`,
  },
  {
    name: ':hover',
    input: `
a {
  background-color: powderblue;
  transition: background-color 0.5s;
}

a:hover {
  background-color: gold;
}
`,
  },
  {
    name: ':last-of-type',
    input: `
p:last-of-type {
  color: red;
  font-style: italic;
}
`,
  },
  {
    name: ':not()',
    input: `
.fancy {
  text-shadow: 2px 2px 3px gold;
}

/* <p> elements that don't have a class \`.fancy\` */
p:not(.fancy) {
  color: green;
}

/* Elements that are not <p> elements */
body :not(p) {
  text-decoration: underline;
}

/* Elements that are not <div>s or \`.fancy\` */
body :not(div):not(.fancy) {
  font-weight: bold;
}

/* Elements that are not <div>s or \`.fancy\` */
body :not(div, .fancy) {
  text-decoration: overline underline;
}

/* Elements inside an <h2> that aren't a <span> with a class of \`.foo\` */
h2 :not(span.foo) {
  color: red;
}
`,
  },
  {
    name: ':root',
    input: `
:root {
  --main-color: hotpink;
  --pane-padding: 5px 42px;
}
`,
  },
];
