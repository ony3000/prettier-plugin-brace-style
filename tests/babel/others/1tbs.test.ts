import { describe, expect, test } from 'vitest';
import { format, baseOptions, oneTBSLinter } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  braceStyle: '1tbs',
};

describe('babel/others/1tbs', () => {
  describe('tabWidth: 4', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n    bar();\n} else {\n    baz();\n}\n`;
    const promise = format(input, { ...options, tabWidth: 4 });

    test('theoretical', async () => {
      const [result] = await oneTBSLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });

  describe('useTabs: true', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\n\tbar();\n} else {\n\tbaz();\n}\n`;
    const promise = format(input, { ...options, useTabs: true });

    test('theoretical', async () => {
      const [result] = await oneTBSLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });

  describe('endOfLine: crlf', () => {
    const input = `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`;
    const output = `if (foo) {\r\n  bar();\r\n} else {\r\n  baz();\r\n}\r\n`;
    const promise = format(input, { ...options, endOfLine: 'crlf' });

    test('theoretical', async () => {
      const [result] = await oneTBSLinter.lintText(await promise);

      expect(result.fixableErrorCount).toBe(0);
    });

    test('practical', async () => {
      expect(await promise).toBe(output);
    });
  });
});
