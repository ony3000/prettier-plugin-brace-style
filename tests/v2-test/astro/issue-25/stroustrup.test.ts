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
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'object assignment',
    input: `
---
const foo = {
  bar: {}
}
---

<script>
const foo = {
  bar: {}
}
</script>
`,
    output: `---
const foo = {
  bar: {},
};
---

<script>
  const foo = {
    bar: {},
  };
</script>
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
---
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
---

<script>
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>
`,
    output: `---
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
---

<script>
  class BaseQueue {
    onFlush() {}

    onFlushFail() {}

    onFlushSuccess() {}
  }
</script>
`,
  },
  {
    name: 'class declaration (2) - static things',
    input: `
---
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
---

<script>
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
</script>
`,
    output: `---
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
---

<script>
  class ClassWithStatic {
    static staticMethod() {}
    static {}
  }
</script>
`,
  },
  {
    name: 'for',
    input: `
---
for (let i = 0; i < 9; i++) {}
---

<script>
for (let i = 0; i < 9; i++) {}
</script>
`,
    output: `---
for (let i = 0; i < 9; i++) {}
---

<script>
  for (let i = 0; i < 9; i++) {}
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
---
if (foo) {}
else if (baz) {}
else {}
---

<script>
if (foo) {}
else if (baz) {}
else {}
</script>
`,
    output: `---
if (foo) {
}
else if (baz) {
}
else {
}
---

<script>
  if (foo) {
  }
  else if (baz) {
  }
  else {
  }
</script>
`,
  },
  {
    name: 'labeled block',
    input: `
---
foo: {}
---

<script>
foo: {}
</script>
`,
    output: `---
foo: {
}
---

<script>
  foo: {
  }
</script>
`,
  },
  {
    name: 'switch (1)',
    input: `
---
switch (expr) {}
---

<script>
switch (expr) {}
</script>
`,
    output: `---
switch (expr) {
}
---

<script>
  switch (expr) {
  }
</script>
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
---
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
---

<script>
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
</script>
`,
    output: `---
switch (action) {
  case "say_hello": {
  }
  case "say_hi": {
  }
  default: {
  }
}
---

<script>
  switch (action) {
    case "say_hello": {
    }
    case "say_hi": {
    }
    default: {
    }
  }
</script>
`,
  },
  {
    name: 'try...catch...finally',
    input: `
---
try {}
catch (ex) {}
finally {}
---

<script>
try {}
catch (ex) {}
finally {}
</script>
`,
    output: `---
try {
}
catch (ex) {
}
finally {
}
---

<script>
  try {
  }
  catch (ex) {
  }
  finally {
  }
</script>
`,
  },
  {
    name: 'while',
    input: `
---
while (n < 3) {}
---

<script>
while (n < 3) {}
</script>
`,
    output: `---
while (n < 3) {}
---

<script>
  while (n < 3) {}
</script>
`,
  },
  {
    name: 'do...while',
    input: `
---
do {} while (i < 5);
---

<script>
do {} while (i < 5);
</script>
`,
    output: `---
do {} while (i < 5);
---

<script>
  do {} while (i < 5);
</script>
`,
  },
];

describe('astro/issue-25/stroustrup', () => {
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
