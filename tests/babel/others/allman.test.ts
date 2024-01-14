import { describe, expect, test } from 'vitest';

import { format, baseOptions, allmanLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: 'allman',
};

describe('babel/others/allman', () => {
  describe('tabWidth: 4', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo)\n{\n    bar();\n}\nelse\n{\n    baz();\n}\n`;
    const promise = format(input, { ...options, tabWidth: 4 });

    test('theoretical', async () => {
      const [result] = await allmanLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });

  describe('useTabs: true', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo)\n{\n\tbar();\n}\nelse\n{\n\tbaz();\n}\n`;
    const promise = format(input, { ...options, useTabs: true });

    test('theoretical', async () => {
      const [result] = await allmanLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });

  describe('endOfLine: crlf', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo)\r\n{\r\n  bar();\r\n}\r\nelse\r\n{\r\n  baz();\r\n}\r\n`;
    const promise = format(input, { ...options, endOfLine: 'crlf' });

    test('theoretical', async () => {
      const [result] = await allmanLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });
});
