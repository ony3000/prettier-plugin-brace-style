import { describe, expect, test } from 'vitest';

import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
  braceStyle: 'stroustrup',
};

describe('babel/others/stroustrup', () => {
  test('tabWidth: 4', async () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n    bar();\n}\nelse {\n    baz();\n}\n`;

    expect(await format(input, { ...options, tabWidth: 4 })).toBe(output);
  });

  test('useTabs: true', async () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n\tbar();\n}\nelse {\n\tbaz();\n}\n`;

    expect(await format(input, { ...options, useTabs: true })).toBe(output);
  });

  test('endOfLine: crlf', async () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\r\n  bar();\r\n}\r\nelse {\r\n  baz();\r\n}\r\n`;

    expect(await format(input, { ...options, endOfLine: 'crlf' })).toBe(output);
  });
});
