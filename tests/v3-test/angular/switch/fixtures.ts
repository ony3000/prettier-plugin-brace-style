import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'switch (1)',
    input: `
<script lang="ts">
switch (expr) {
  case 'Oranges':
    console.log('Oranges');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
<script lang="ts">
switch (action) {
  case 'say_hello': {
    const message = 'hello';
    console.log(message);
    break;
  }
  case 'say_hi': {
    const message = 'hi';
    console.log(message);
    break;
  }
  default: {
    console.log('Empty action received.');
  }
}
</script>
`,
  },
  {
    name: 'switch (3) - complex expression',
    input: `
<script lang="ts">
switch (expr.toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>
`,
  },
  {
    name: 'switch (4) - more complex expression',
    input: `
<script lang="ts">
switch (String(expr).split('').map(x => x).join('').toUpperCase().toLowerCase()) {
  case 'oranges':
    console.log('oranges');
    break;
  case 'mangoes':
  case 'papayas':
    console.log('mangoes and papayas');
    break;
  default:
    console.log(expr);
}
</script>
`,
  },
];
