import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'template literal',
    input: `
---
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
---

<script>
const x = \`
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
\`
</script>
`,
  },
  {
    name: 'nested template literal',
    input: `
---
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
---

<script>
const x = \`foo: \${1 + (function () { return 2; })() + 3}\`
</script>
`,
  },
];
