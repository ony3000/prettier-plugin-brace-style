import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'stroustrup',
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
}
catch ({ name, message }) {
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
}
finally {
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
}
catch (ex) {
  console.error(ex.message);
}
finally {
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
  }
  finally {
    console.log("finally");
  }
}
catch (ex) {
  console.error("outer", ex.message);
}
`,
  },
];

describe('typescript/try/stroustrup', () => {
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
