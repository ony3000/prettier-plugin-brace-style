import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
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
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
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
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
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
    options: {
      endOfLine: 'crlf',
    },
  },
];
