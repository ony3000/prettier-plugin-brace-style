import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\n    bar();\n} else {\n    baz();\n}\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\n\tbar();\n} else {\n\tbaz();\n}\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    output: `if (foo) {\r\n  bar();\r\n} else {\r\n  baz();\r\n}\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('typescript/others/1tbs', () => {
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
