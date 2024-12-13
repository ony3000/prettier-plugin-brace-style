import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  braceStyle: 'stroustrup',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    output: `---\nif (foo) {\n    bar();\n}\nelse {\n    baz();\n}\n---\n\n<script>\n    if (foo) {\n        bar();\n    }\n    else {\n        baz();\n    }\n</script>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    output: `---\nif (foo) {\n\tbar();\n}\nelse {\n\tbaz();\n}\n---\n\n<script>\n\tif (foo) {\n\t\tbar();\n\t}\n\telse {\n\t\tbaz();\n\t}\n</script>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    output: `---\r\nif (foo) {\r\n  bar();\r\n}\r\nelse {\r\n  baz();\r\n}\r\n---\r\n\r\n<script>\r\n  if (foo) {\r\n    bar();\r\n  }\r\n  else {\r\n    baz();\r\n  }\r\n</script>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('astro/others/stroustrup', () => {
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
