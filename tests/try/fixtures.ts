export const tryCatchCode = `
try {
  throw new TypeError("oops");
} catch ({ name, message }) {
  console.log(name);
  console.log(message);
}
`;

export const tryFinallyCode = `
openMyFile();
try {
  writeMyFile(theData);
} finally {
  closeMyFile();
}
`;

export const tryCatchFinallyCode = `
try {
  throw new Error("oops");
} catch (ex) {
  console.error(ex.message);
} finally {
  console.log("finally");
}
`;

export const nestedTryCode = `
try {
  try {
    throw new Error("oops");
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}
`;
