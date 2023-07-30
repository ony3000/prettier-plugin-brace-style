export const ifCodeResult = `if (foo)
{
  bar();
}
`;

export const ifElseCodeResult = `if (foo)
{
  bar();
}
else
{
  baz();
}
`;

export const ifElseifElseCodeResult = `if (foo)
{
  bar();
}
else if (baz)
{
  qux();
}
else
{
  quux();
}
`;

export const ifElseCodeWithCommentResult = `// foo is truthy
if (foo)
{
  bar();
}
// foo is falsy
else
{
  baz();
}
`;

export const ifCodeContainingOnlyCommentsInBracketsResult = `if (condition)
{
  // statement
}
`;
