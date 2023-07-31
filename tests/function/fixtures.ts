export const functionDeclarationCode = `
function sum(a, b) {
  return a + b;
}
`;

export const functionExpressionCode = `
const sum = function (a, b) {
  return a + b;
}
`;

export const arrowFunctionExpressionCode = `
const sum = (a, b) => {
  return a + b;
}
`;

export const functionCode1 = `
function foo(/* args here */) {
  statement;
}
`;

export const functionCode2 = `
function foo(
  /* args here */
) {
  statement;
}
`;

export const functionCode3 = `
function foo(
  // args here
) {
  statement;
}
`;

export const functionCode4 = `
function foo(/* arg */ // arg
  // arg
/* arg */) {
  statement;
}
`;
