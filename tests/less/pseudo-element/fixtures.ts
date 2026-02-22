import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '::after',
    input: `
.exciting-text::after {
  content: " <- EXCITING!";
  color: darkgreen;
  font-weight: bolder;
}

.boring-text::after {
  content: " <- BORING";
  color: darkviolet;
  font-weight: bolder;
}
`,
  },
  {
    name: '::before',
    input: `
q::before {
  content: "«";
  color: blue;
}

q::after {
  content: "»";
  color: red;
}
`,
  },
  {
    name: '::first-letter',
    input: `
p {
  width: 500px;
  line-height: 1.5;
}

h2 + p::first-letter {
  color: white;
  background-color: black;
  border-radius: 2px;
  box-shadow: 3px 3px 0 red;
  font-size: 250%;
  padding: 6px 3px;
  margin-right: 6px;
  float: left;
}
`,
  },
  {
    name: '::marker',
    input: `
ul li::marker {
  color: red;
  font-size: 1.5em;
}
`,
  },
  {
    name: '::placeholder',
    input: `
input::placeholder {
  color: red;
  font-size: 1.2em;
  font-style: italic;
  opacity: 0.5;
}
`,
  },
  {
    name: '::selection',
    input: `
/* Make selected text gold on a red background */
::selection {
  color: gold;
  background-color: red;
}

/* Make selected text in a paragraph white on a blue background */
p::selection {
  color: white;
  background-color: blue;
}
`,
  },
];
