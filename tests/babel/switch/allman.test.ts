import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'switch',
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
    output: `switch (expr)
{
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
    name: 'switch (case with block)',
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
    output: `switch (action)
{
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

describe('babel/switch/allman', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect({ input: fixture.input, options }).toBeFormattedAs(fixture.output);
    });
  }
});
