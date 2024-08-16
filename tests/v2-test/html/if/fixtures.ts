import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'if',
    input: `
<script lang="ts">
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
<script lang="ts">
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
<script lang="ts">
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
<script lang="ts">
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
