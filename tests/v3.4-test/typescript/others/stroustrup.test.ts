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
    name: 'tabWidth: 4',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\n    bar();\n}\nelse {\n    baz();\n}\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\n\tbar();\n}\nelse {\n\tbaz();\n}\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\r\n  bar();\r\n}\r\nelse {\r\n  baz();\r\n}\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('typescript/others/stroustrup', () => {
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
