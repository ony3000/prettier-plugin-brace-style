import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'object assignment',
    input: `
<script lang="ts">
const foo = {
  bar: {}
}
</script>
`,
  },
  {
    name: 'destructuring assignment with default value',
    input: `
<script lang="ts">
const renderComponent = ({handleSubmit = () => {}, errors}) => {
  return null;
};
</script>
`,
  },
  {
    name: 'class declaration (1) - empty method',
    input: `
<script lang="ts">
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
<script lang="ts">
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
<script lang="ts">
for (let i = 0; i < 9; i++) {}
</script>
`,
  },
  {
    name: 'if...elseif...else',
    input: `
<script lang="ts">
if (foo) {}
else if (baz) {}
else {}
</script>
`,
  },
  {
    name: 'labeled block',
    input: `
<script lang="ts">
foo: {}
</script>
`,
  },
  {
    name: 'switch (1)',
    input: `
<script lang="ts">
switch (expr) {}
</script>
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
<script lang="ts">
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
<script lang="ts">
try {}
catch (ex) {}
finally {}
</script>
`,
  },
  {
    name: 'while',
    input: `
<script lang="ts">
while (n < 3) {}
</script>
`,
  },
  {
    name: 'do...while',
    input: `
<script lang="ts">
do {} while (i < 5);
</script>
`,
  },
];
