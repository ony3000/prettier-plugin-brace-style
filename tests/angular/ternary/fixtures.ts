import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) ternary operator',
    input: `
<script lang="ts">
const x = condition ? function foo() {} : function bar() {return 0;}
</script>
`,
  },
  {
    name: '(2) nested ternary operator',
    input: `
<script lang="ts">
const x = condition1
? (condition2 ? function foo() {} : function bar() {return 0;})
: (condition3 ? function baz() {} : function qux() {return 0;})
</script>
`,
  },
];
