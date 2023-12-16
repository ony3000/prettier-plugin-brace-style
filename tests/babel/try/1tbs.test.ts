import type { Fixture } from '../../settings';
import { format, baseOptions, oneTBSLinter } from '../../settings';

const options = {
  ...baseOptions,
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
    const formattedText = format(fixture.input, options);

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await oneTBSLinter.lintText(formattedText);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', () => {
        expect(formattedText).toBe(fixture.output);
      });
    });
  }
});
