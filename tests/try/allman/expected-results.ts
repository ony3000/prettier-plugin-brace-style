export const tryCatchCodeResult = `try
{
  throw new TypeError("oops");
}
catch ({ name, message })
{
  console.log(name);
  console.log(message);
}
`;

export const tryFinallyCodeResult = `openMyFile();
try
{
  writeMyFile(theData);
}
finally
{
  closeMyFile();
}
`;

export const tryCatchFinallyCodeResult = `try
{
  throw new Error("oops");
}
catch (ex)
{
  console.error(ex.message);
}
finally
{
  console.log("finally");
}
`;

export const nestedTryCodeResult = `try
{
  try
  {
    throw new Error("oops");
  }
  finally
  {
    console.log("finally");
  }
}
catch (ex)
{
  console.error("outer", ex.message);
}
`;
