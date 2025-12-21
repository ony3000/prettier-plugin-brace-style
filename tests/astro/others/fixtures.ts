import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
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
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
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
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
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
    options: {
      endOfLine: 'crlf',
    },
  },
];
