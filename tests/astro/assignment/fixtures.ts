import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment (1)',
    input: `
---
const foo = {}
---

<script>
const foo = {}
</script>
`,
  },
  {
    name: 'object assignment (2)',
    input: `
---
const foo = {
  bar: {
    baz: 'baz'
  }
}
---

<script>
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
---
const foo = {
  bar() {},
  ['baz']() {}
}
---

<script>
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
---
const foo = true && {
  bar: 'baz'
}
---

<script>
const foo = true && {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'conditional assignment (2)',
    input: `
---
const foo = false || {
  bar: 'baz'
}
---

<script>
const foo = false || {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'conditional assignment (3)',
    input: `
---
const foo = null ?? {
  bar: 'baz'
}
---

<script>
const foo = null ?? {
  bar: 'baz'
}
</script>
`,
  },
  {
    name: 'destructuring assignment (1)',
    input: `
---
const {foo, bar: {baz}} = {}
---

<script>
const {foo, bar: {baz}} = {}
</script>
`,
  },
  {
    name: 'destructuring assignment (2)',
    input: `
---
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
---

<script>
arr.forEach(({ data: { message: { errors } } }) => {
  // code
});
</script>
`,
  },
];
