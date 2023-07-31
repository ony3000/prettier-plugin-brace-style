export const ifCode = `
if (foo)
{
  bar();
}
`;

export const ifElseCode = `
if (foo) {
  bar();
}
else {
  baz();
}
`;

export const ifElseifElseCode = `
if (foo) {
  bar();
} else if (baz) {
  qux();
} else {
  quux();
}
`;

export const ifElseCodeWithComment = `
// foo is truthy
if (foo) {
  bar();
}
// foo is falsy
else {
  baz();
}
`;

export const ifCode1 = `
if (condition) {
  // statement
}
`;

export const ifCode2 = `
if (condition) {
  /* statement */
}
`;

export const ifCode3 = `
if (condition) {/* statement */}
`;

export const ifCode4 = `
if (condition) {/* statement */
  // statement
/* statement */}
`;

export const ifElseifElseCode1 = `
if (condition1) {/* statement1 */}
else if (condition2) {/* statement2 */}
else {/* statement3 */}
`;

export const nestedIfCode1 = `
if (condition1) {
  if (condition2) {/* statement */}
}
`;
