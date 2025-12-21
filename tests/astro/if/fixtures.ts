import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'if',
    input: `
---
if (foo)
{
  bar();
}
---

<script>
if (foo)
{
  bar();
}
</script>
`,
  },
  {
    name: 'if...else (1)',
    input: `
---
if (foo) {
  bar();
}
else {
  baz();
}
---

<script>
if (foo) {
  bar();
}
else {
  baz();
}
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
---
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
---

<script>
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>
`,
  },
  {
    name: 'if...else (2) - with comment',
    input: `
---
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
---

<script>
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
</script>
`,
  },
];
