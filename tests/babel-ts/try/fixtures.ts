import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
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
  },
];
