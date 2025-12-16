import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n---\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n---\n\n<script>\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];
