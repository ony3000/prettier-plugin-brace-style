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

export const ifCodeContainingOnlyCommentsInBrackets = `
if (condition) {
  // statement
}
`;
