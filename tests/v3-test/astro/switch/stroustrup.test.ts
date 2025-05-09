import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
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
  {
    name: 'switch (3) - complex expression',
    input: `
---
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
---

<script>
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
    output: `---
switch (expr.toLowerCase()) {
  case "oranges":
    console.log("oranges");
    break;
  case "mangoes":
  case "papayas":
    console.log("mangoes and papayas");
    break;
  default:
    console.log(expr);
}
---

<script>
  switch (expr.toLowerCase()) {
    case "oranges":
      console.log("oranges");
      break;
    case "mangoes":
    case "papayas":
      console.log("mangoes and papayas");
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
---
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
---

<script>
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
    output: `---
switch (
  String(expr)
    .split("")
    .map((x) => x)
    .join("")
    .toUpperCase()
    .toLowerCase()
) {
  case "oranges":
    console.log("oranges");
    break;
  case "mangoes":
  case "papayas":
    console.log("mangoes and papayas");
    break;
  default:
    console.log(expr);
}
---

<script>
  switch (
    String(expr)
      .split("")
      .map((x) => x)
      .join("")
      .toUpperCase()
      .toLowerCase()
  ) {
    case "oranges":
      console.log("oranges");
      break;
    case "mangoes":
    case "papayas":
      console.log("mangoes and papayas");
      break;
    default:
      console.log(expr);
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
