import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
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
    output: `---
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
    output: `---
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
  /*
  {
    name: 'ignore comment (3)',
    input: `
<!-- prettier-ignore -->
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
    output: `<!-- prettier-ignore -->
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
  */
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
    output: `---
/**
 * prettier-ignore
 */
if (condition1)
{
  foo;
}
else if (condition2)
{
  bar;
}
else
{
  baz;
}
---

<!--
 ! prettier-ignore
-->
<script>
  if (condition1)
  {
    foo;
  }
  else if (condition2)
  {
    bar;
  }
  else
  {
    baz;
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
    output: `---
// /* prettier-ignore */
if (condition1)
{
  foo;
}
else if (condition2)
{
  bar;
}
else
{
  baz;
}
---

<!-- /* prettier-ignore */ -->
<script>
  if (condition1)
  {
    foo;
  }
  else if (condition2)
  {
    bar;
  }
  else
  {
    baz;
  }
</script>
`,
  },
];

describe('astro/prettier-ignore/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
