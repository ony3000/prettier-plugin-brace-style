import { format, baseOptions } from '../../settings';
import { whileCode, doWhileCode } from '../fixtures';

const options = {
  ...baseOptions,
  braceStyle: 'stroustrup',
};

describe('stroustrup - while statements', () => {
  test('while', () => {
    const expectedResult = `let n = 0;

while (n < 3) {
  n++;
}
`;

    expect(format(whileCode, options)).toBe(expectedResult);
  });

  test('do...while', () => {
    const expectedResult = `let result = "";
let i = 0;

do {
  i = i + 1;
  result = result + i;
} while (i < 5);
`;

    expect(format(doWhileCode, options)).toBe(expectedResult);
  });
});
