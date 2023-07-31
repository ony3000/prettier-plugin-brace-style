export const ifCodeResult = `if (foo) {
  bar();
}
`;

export const ifElseCodeResult = `if (foo) {
  bar();
}
else {
  baz();
}
`;

export const ifElseifElseCodeResult = `if (foo) {
  bar();
}
else if (baz) {
  qux();
}
else {
  quux();
}
`;

export const ifElseCodeWithCommentResult = `// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
`;

export const ifCode1Result = `if (condition) {
  // statement
}
`;

export const ifCode2Result = `if (condition) {
  /* statement */
}
`;

export const ifCode3Result = `if (condition) {
  /* statement */
}
`;

export const ifCode4Result = `if (condition) {
  /* statement */
  // statement
  /* statement */
}
`;

export const ifElseifElseCode1Result = `if (condition1) {
  /* statement1 */
}
else if (condition2) {
  /* statement2 */
}
else {
  /* statement3 */
}
`;

export const nestedIfCode1Result = `if (condition1) {
  if (condition2) {
    /* statement */
  }
}
`;
