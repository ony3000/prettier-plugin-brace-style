import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { oneTBSLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'try...catch',
    input: `
try {
  throw new TypeError("oops");
} catch ({ name, message }) {
  console.log(name);
  console.log(message);
}
`,
    output: `try {
  throw new TypeError("oops");
} catch ({ name, message }) {
  console.log(name);
  console.log(message);
}
`,
  },
  {
    name: 'try...finally',
    input: `
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
`,
    output: `openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
`,
  },
  {
    name: 'try...catch...finally',
    input: `
try {
  throw new Error("oops");
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log("finally");
}
`,
    output: `try {
  throw new Error("oops");
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log("finally");
}
`,
  },
  {
    name: 'nested try',
    input: `
try {
  try {
    throw new Error("oops");
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}
`,
    output: `try {
  try {
    throw new Error("oops");
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}
`,
  },
];

describe('babel/try/1tbs', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await oneTBSLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
