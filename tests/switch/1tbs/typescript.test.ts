import { format, baseOptions } from '../../settings';
import { switchCode, switchCodeWithBlock } from '../fixtures';

const options = {
  ...baseOptions,
  braceStyle: '1tbs',
};

describe('1tbs - switch statements', () => {
  test('switch', () => {
    const expectedResult = `switch (expr) {
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
`;

    expect(format(switchCode, options)).toBe(expectedResult);
  });

  test('switch (case with block)', () => {
    const expectedResult = `switch (action) {
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
`;

    expect(format(switchCodeWithBlock, options)).toBe(expectedResult);
  });
});
