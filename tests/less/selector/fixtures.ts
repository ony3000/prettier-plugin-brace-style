import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '& nesting selector',
    input: `
.example {
  font-family: system-ui;
  font-size: 1.2rem;
  & > a {
    color: tomato;
    &:hover,
    &:focus {
      color: ivory;
      background-color: tomato;
    }
  }
}
`,
  },
  {
    name: 'attribute selector',
    input: `
a {
  color: blue;
}

/* Internal links, beginning with "#" */
a[href^="#"] {
  background-color: gold;
}

/* Links with "example" anywhere in the URL */
a[href*="example"] {
  background-color: silver;
}

/* Links with "insensitive" anywhere in the URL,
   regardless of capitalization */
a[href*="insensitive" i] {
  color: cyan;
}

/* Links with "cAsE" anywhere in the URL,
with matching capitalization */
a[href*="cAsE" s] {
  color: pink;
}

/* Links that end in ".org" */
a[href$=".org"] {
  color: red;
}

/* Links that start with "https://" and end in ".org" */
a[href^="https://"][href$=".org"] {
  color: green;
}
`,
  },
  {
    name: 'class selector',
    input: `
.red {
  color: #ff3333;
}

.yellow-bg {
  background: #ffffaa;
}

.fancy {
  font-weight: bold;
  text-shadow: 4px 4px 3px #7777ff;
}
`,
  },
  {
    name: 'id selector',
    input: `
#blue {
  background-color: skyblue;
}
`,
  },
  {
    name: 'keyframe selector',
    input: `
@keyframes slide-and-fade {
  from {
    transform: translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: translateX(50vw);
    opacity: 0;
  }
}
`,
  },
  {
    name: 'namespace separator',
    input: `
@namespace svgNamespace url("http://www.w3.org/2000/svg");
@namespace htmlNameSpace url("http://www.w3.org/1999/xhtml");
/* All \`<a>\`s in the default namespace, in this case, all \`<a>\`s */
a {
  font-size: 1.4rem;
}
/* no namespace */
|a {
  text-decoration: wavy overline lime;
  font-weight: bold;
}
/* all namespaces (including no namespace) */
*|a {
  color: red;
  fill: red;
  font-style: italic;
}
/* only the svgNamespace namespace, which is <svg> content */
svgNamespace|a {
  color: green;
  fill: green;
}
/* The htmlNameSpace namespace, which is the HTML document */
htmlNameSpace|a {
  text-decoration-line: line-through;
}
`,
  },
  {
    name: 'selector list',
    input: `
h1, h2, h3, h4, h5, h6 {
  font-family: "Helvetica", "Arial";
}

#main,
.content,
article,
h1 + p {
  font-size: 1.1em;
}
`,
  },
  {
    name: 'type selector',
    input: `
span {
  background-color: skyblue;
}
`,
  },
  {
    name: 'universal selector',
    input: `
* [lang^="en"] {
  color: green;
}

*.warning {
  color: red;
}

*#maincontent {
  border: 1px solid blue;
}

.floating {
  float: left;
}

/* automatically clear the next sibling after a floating element */
.floating + * {
  clear: left;
}
`,
  },
];
