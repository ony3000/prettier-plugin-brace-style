export const functionDeclarationCodeResult = `function sum(a, b) {
  return a + b;
}
`;

export const functionExpressionCodeResult = `const sum = function (a, b) {
  return a + b;
};
`;

export const arrowFunctionExpressionCodeResult = `const sum = (a, b) => {
  return a + b;
};
`;

export const functionCode1Result = `function foo(/* args here */) {
  statement;
}
`;

export const functionCode2Result = `function foo() {
/* args here */
  statement;
}
`;

export const functionCode3Result = `function foo() {
// args here
  statement;
}
`;

export const functionCode4Result = `function foo /* arg */() { // arg
// arg
/* arg */
  statement;
}
`;
