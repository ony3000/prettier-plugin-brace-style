import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { stroustrupLinter } from 'test-settings/linter';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
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
    name: 'labeled block',
    input: `
foo: {}
`,
    output: `foo: {
}
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

describe('babel/issue-25/stroustrup', () => {
  for (const fixture of fixtures) {
    const promise = format(fixture.input, {
      ...options,
      ...(fixture.options ?? {}),
    });

    describe(fixture.name, () => {
      test('theoretical', async () => {
        const [result] = await stroustrupLinter.lintText(await promise);

        expect(result.fixableErrorCount).toBe(0);
      });

      test('practical', async () => {
        expect(await promise).toBe(fixture.output);
      });
    });
  }
});
