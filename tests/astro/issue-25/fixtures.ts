import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment',
    input: `
---
const foo = {
  bar: {}
}
---

<script>
const foo = {
  bar: {}
}
</script>
`,
  },
  {
    name: 'destructuring assignment with default value',
    input: `
---
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
---

<script>
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
</script>
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
---
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
---

<script>
class BaseQueue {
  onFlush() {}

  onFlushFail() {}

  onFlushSuccess() {}
}
</script>
`,
  },
  {
    name: 'class declaration (2) - static things',
    input: `
---
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
---

<script>
class ClassWithStatic {
  static staticMethod() {}
  static {}
}
</script>
`,
  },
  {
    name: 'for',
    input: `
---
for (let i = 0; i < 9; i++) {}
---

<script>
for (let i = 0; i < 9; i++) {}
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
---
if (foo) {}
else if (baz) {}
else {}
---

<script>
if (foo) {}
else if (baz) {}
else {}
</script>
`,
  },
  {
    name: 'labeled block',
    input: `
---
foo: {}
---

<script>
foo: {}
</script>
`,
  },
  {
    name: 'switch (1)',
    input: `
---
switch (expr) {}
---

<script>
switch (expr) {}
</script>
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
---
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
---

<script>
switch (action) {
  case 'say_hello': {}
  case 'say_hi': {}
  default: {}
}
</script>
`,
  },
  {
    name: 'try...catch...finally',
    input: `
---
try {}
catch (ex) {}
finally {}
---

<script>
try {}
catch (ex) {}
finally {}
</script>
`,
  },
  {
    name: 'while',
    input: `
---
while (n < 3) {}
---

<script>
while (n < 3) {}
</script>
`,
  },
  {
    name: 'do...while',
    input: `
---
do {} while (i < 5);
---

<script>
do {} while (i < 5);
</script>
`,
  },
];
