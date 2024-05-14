import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'object assignment',
    input: `
const foo = {
  bar: {}
}
`,
    output: `const foo = {
  bar: {},
};
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
    output: `const renderComponent = ({ handleSubmit = () => {}, errors }) => {
  const ref = React.createRef();

  return render(
    <StyleErrorsContextProvider initialState={errors}>
      <PublishButton formRef={ref} handleSubmit={handleSubmit} />
    </StyleErrorsContextProvider>,
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
    output: `class BaseQueue {
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
    output: `class ClassWithStatic {
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
    output: `for (let i = 0; i < 9; i++) {}
`,
  },
  {
    name: 'global augmentation',
    input: `
declare global {}
`,
    output: `declare global {}
`,
  },
  {
    name: 'if...elseif...else',
    input: `
if (foo) {}
else if (baz) {}
else {}
`,
    output: `if (foo) {
}
else if (baz) {
}
else {
}
`,
  },
  {
    name: 'interface declaration',
    input: `
interface Point {}
`,
    output: `interface Point {}
`,
  },
  {
    name: 'labeled block',
    input: `
foo: {}
`,
    output: `foo: {
}
`,
  },
  {
    name: 'ambient module',
    input: `
declare module "url" {}
`,
    output: `declare module "url" {}
`,
  },
  {
    name: 'namespacing',
    input: `
namespace Validation {}
`,
    output: `namespace Validation {}
`,
  },
  {
    name: 'switch (1)',
    input: `
switch (expr) {}
`,
    output: `switch (expr) {
}
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
    output: `switch (action) {
  case "say_hello": {
  }
  case "say_hi": {
  }
  default: {
  }
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
    output: `try {
}
catch (ex) {
}
finally {
}
`,
  },
  {
    name: 'type alias',
    input: `
type Point = {}
`,
    output: `type Point = {};
`,
  },
  {
    name: 'while',
    input: `
while (n < 3) {}
`,
    output: `while (n < 3) {}
`,
  },
  {
    name: 'do...while',
    input: `
do {} while (i < 5);
`,
    output: `do {} while (i < 5);
`,
  },
];

describe('typescript/issue-25/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
