import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `
---
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
---

<script>
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
---
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
---

<script>
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
<div>
<script>
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
</div>
`,
  },
  {
    name: 'ignore comment (4)',
    input: `
<div>
  <!-- prettier-ignore -->
  <div>
    <script is:inline>
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
  </div>
  <div>
    <script is:inline>
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
  </div>
</div>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
---
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
---

<!--
 ! prettier-ignore
-->
<script>
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
---
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
---

<!-- /* prettier-ignore */ -->
<script>
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
