import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', 'ppbs-070'],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'switch (1)',
    input: `
---
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
---

<script>
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
    output: `---
switch (expr) {
  case "Oranges":
    console.log("Oranges");
    break;
  case "Mangoes":
  case "Papayas":
    console.log("Mangoes and papayas");
    break;
  default:
    console.log(expr);
}
---

<script>
  switch (expr) {
    case "Oranges":
      console.log("Oranges");
      break;
    case "Mangoes":
    case "Papayas":
      console.log("Mangoes and papayas");
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
---
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
---

<script>
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
    output: `---
switch (action) {
  case "say_hello": {
    const message = "hello";
    console.log(message);
    break;
  }
  case "say_hi": {
    const message = "hi";
    console.log(message);
    break;
  }
  default: {
    console.log("Empty action received.");
  }
}
---

<script>
  switch (action) {
    case "say_hello": {
      const message = "hello";
      console.log(message);
      break;
    }
    case "say_hi": {
      const message = "hi";
      console.log(message);
      break;
    }
    default: {
      console.log("Empty action received.");
    }
  }
</script>
`,
  },
];

describe('astro/switch/stroustrup', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
