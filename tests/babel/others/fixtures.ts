import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];
