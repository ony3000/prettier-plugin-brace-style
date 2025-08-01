import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'try...catch',
    input: `
---
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
---

<script>
try {
  throw new TypeError('oops');
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
</script>
`,
    output: `---
try {
  throw new TypeError("oops");
} catch (ex) {
  console.log(ex.name);
  console.log(ex.message);
}
---

<script>
  try {
    throw new TypeError("oops");
  } catch (ex) {
    console.log(ex.name);
    console.log(ex.message);
  }
</script>
`,
  },
  {
    name: 'try...finally',
    input: `
---
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
---

<script>
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
</script>
`,
    output: `---
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
---

<script>
  openMyFile();
  try {
    writeMyFile(theData);
  } finally {
    closeMyFile();
  }
</script>
`,
  },
  {
    name: 'try...catch...finally',
    input: `
---
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
---

<script>
try {
  throw new Error('oops');
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log('finally');
}
</script>
`,
    output: `---
try {
  throw new Error("oops");
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log("finally");
}
---

<script>
  try {
    throw new Error("oops");
  } catch (ex) {
    console.error(ex.message);
  } finally {
    console.log("finally");
  }
</script>
`,
  },
  {
    name: 'nested try',
    input: `
---
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
---

<script>
try {
  try {
    throw new Error('oops');
  } finally {
    console.log('finally');
  }
} catch (ex) {
  console.error('outer', ex.message);
}
</script>
`,
    output: `---
try {
  try {
    throw new Error("oops");
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}
---

<script>
  try {
    try {
      throw new Error("oops");
    } finally {
      console.log("finally");
    }
  } catch (ex) {
    console.error("outer", ex.message);
  }
</script>
`,
  },
];

describe('astro/try/1tbs', () => {
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
