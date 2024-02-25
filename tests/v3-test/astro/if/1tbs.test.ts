import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'if',
    input: `
---
if (foo)
{
  bar();
}
---

<script>
if (foo)
{
  bar();
}
</script>
`,
    output: `---
if (foo) {
  bar();
}
---

<script>
  if (foo) {
    bar();
  }
</script>
`,
  },
  {
    name: 'if...else (1)',
    input: `
---
if (foo) {
  bar();
}
else {
  baz();
}
---

<script>
if (foo) {
  bar();
}
else {
  baz();
}
</script>
`,
    output: `---
if (foo) {
  bar();
} else {
  baz();
}
---

<script>
  if (foo) {
    bar();
  } else {
    baz();
  }
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
---
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
---

<script>
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
</script>
`,
    output: `---
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
---

<script>
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
---
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
---

<script>
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
    output: `---
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
---

<script>
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

describe('astro/if/1tbs', () => {
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
