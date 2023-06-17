import { format, baseOptions } from '../settings';
import { tryCatchCode, tryFinallyCode, tryCatchFinallyCode, nestedTryCode } from './fixtures';

const options = {
  ...baseOptions,
  braceStyle: '1tbs',
};

describe('1tbs - try statements', () => {
  test('try...catch', () => {
    const expectedResult = `try {
  throw new TypeError("oops");
} catch ({ name, message }) {
  console.log(name);
  console.log(message);
}
`;

    expect(format(tryCatchCode, options)).toBe(expectedResult);
  });

  test('try...finally', () => {
    const expectedResult = `openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
`;

    expect(format(tryFinallyCode, options)).toBe(expectedResult);
  });

  test('try...catch...finally', () => {
    const expectedResult = `try {
  throw new Error("oops");
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log("finally");
}
`;

    expect(format(tryCatchFinallyCode, options)).toBe(expectedResult);
  });

  test('nested try', () => {
    const expectedResult = `try {
  try {
    throw new Error("oops");
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}
`;

    expect(format(nestedTryCode, options)).toBe(expectedResult);
  });
});
