import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `
<script lang="ts">
// prettier-ignore
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
  {
    name: 'ignore comment (2)',
    input: `
<script lang="ts">
/* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
  {
    name: 'ignore comment (3)',
    input: `
<!-- prettier-ignore -->
<script lang="ts">
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
<script lang="ts">
/**
 * prettier-ignore
 */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
<script lang="ts">
// /* prettier-ignore */
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (3)',
    input: `
<!-- /* prettier-ignore */ -->
<script lang="ts">
if (condition1) {
  foo
} else if (condition2) {
  bar
}
else
{
  baz
}
</script>
`,
  },
];
