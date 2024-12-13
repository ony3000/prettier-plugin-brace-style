import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

const options = {
  ...baseOptions,
  plugins: ['ppbs-070'],
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'switch (1)',
    input: `
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
`,
    output: `switch (expr) {
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
`,
  },
  {
    name: 'switch (2) - case with block',
    input: `
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
`,
    output: `switch (action) {
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
`,
  },
];

describe('typescript/switch/stroustrup', () => {
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
