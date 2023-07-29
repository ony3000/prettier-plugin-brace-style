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

export const functionCodeContainingOnlyCommentsInBrackets = `
function foo(/* args here */) {
  statement;
}
`;
