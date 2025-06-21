import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

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
    output: `<!-- prettier-ignore -->
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
    output: `<div>
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
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
