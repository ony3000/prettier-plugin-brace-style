import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'while',
    input: `
<script lang="ts">
let n = 0;

while (n < 3) {
  n++;
}
</script>
`,
  },
  {
    name: 'do...while',
    input: `
<script lang="ts">
let result = '';
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
</script>
`,
  },
];
