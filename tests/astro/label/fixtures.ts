import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'labeled block',
    input: `
---
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
---

<script>
foo: {
  console.log('face');
  break foo;
  console.log('this will not be executed');
}
console.log('swap');
</script>
`,
  },
];
