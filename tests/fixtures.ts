export const exampleCode = `function foo() {
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}

if (foo) {
  bar();
}
else {
  baz();
}

class C
{
    static
    {
        foo();
    }
}

if (foo) bar();
else if (baz) boom();
`;
