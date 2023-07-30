export const functionDeclarationCodeResult = `function sum(a, b)
{
  return a + b;
}
`;

export const functionExpressionCodeResult = `const sum = function (a, b)
{
  return a + b;
};
`;

export const arrowFunctionExpressionCodeResult = `const sum = (a, b) =>
{
  return a + b;
};
`;

export const functionCodeContainingOnlyCommentsInBracketsResult = `function foo(/* args here */)
{
  statement;
}
`;
