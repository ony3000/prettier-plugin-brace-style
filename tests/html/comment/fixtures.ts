import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'single line comment (1)',
    input: `
<script lang="ts">
//class Foo {}
</script>
`,
  },
  {
    name: 'single line comment (2) - applied to multi line',
    input: `
<script lang="ts">
// function foo() {
//   bar;
// }
</script>
`,
  },
  {
    name: 'multi line comment',
    input: `
<script lang="ts">
/*
if (foo) {
  bar();
} else {
  baz();
}
*/
</script>
`,
  },
];
