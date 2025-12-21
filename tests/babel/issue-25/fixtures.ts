import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment',
    input: `
const foo = {
  bar: {}
}
`,
  },
  {
    name: 'destructuring assignment with default value',
    input: `
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  const ref = React.createRef();

  return render(
    <StyleErrorsContextProvider initialState={errors}>
      <PublishButton formRef={ref} handleSubmit={handleSubmit} />
    </StyleErrorsContextProvider>
  );
};
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
`,
  },
  {
    name: 'class declaration (2) - static things',
    input: `
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
`,
  },
  {
    name: 'for',
    input: `
for (let i = 0; i < 9; i++) {}
`,
  },
  {
    name: 'if...elseif...else',
    input: `
if (foo) {}
else if (baz) {}
else {}
`,
  },
  {
    name: 'labeled block',
    input: `
foo: {}
`,
  },
  {
    name: 'switch (1)',
    input: `
switch (expr) {}
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
`,
  },
  {
    name: 'try...catch...finally',
    input: `
try {}
catch (ex) {}
finally {}
`,
  },
  {
    name: 'while',
    input: `
while (n < 3) {}
`,
  },
  {
    name: 'do...while',
    input: `
do {} while (i < 5);
`,
  },
];
