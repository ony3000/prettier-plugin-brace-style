import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment (1)',
    input: `
<script lang="ts">
const foo = {}
</script>
`,
  },
  {
    name: 'object assignment (2)',
    input: `
<script lang="ts">
const foo = {
  bar: {
    baz: 'baz'
  }
}
</script>
`,
  },
  {
    name: 'object assignment (3)',
    input: `
<script lang="ts">
const foo = {
  bar() {},
  ['baz']() {}
}
</script>
`,
  },
  {
    name: 'conditional assignment (1)',
    input: `
<script lang="ts">
const foo = true && {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `
<script lang="ts">
const foo = false || {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `
<script lang="ts">
const foo = null ?? {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `
<script lang="ts">
const {foo, bar: {baz}} = {}
</script>
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `
<script lang="ts">
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>
`,
  },
];
