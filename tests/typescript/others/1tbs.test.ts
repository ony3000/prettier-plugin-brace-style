import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: '1tbs',
};

describe('babel/others/1tbs', () => {
  test('tabWidth: 4', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n    bar();\n} else {\n    baz();\n}\n`;

    expect({ input, options: { ...options, tabWidth: 4 } }).toBeFormattedAs(output);
  });

  test('useTabs: true', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n\tbar();\n} else {\n\tbaz();\n}\n`;

    expect({ input, options: { ...options, useTabs: true } }).toBeFormattedAs(output);
  });

  test('endOfLine: crlf', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\r\n  bar();\r\n} else {\r\n  baz();\r\n}\r\n`;

    expect({ input, options: { ...options, endOfLine: 'crlf' } }).toBeFormattedAs(output);
  });
});
