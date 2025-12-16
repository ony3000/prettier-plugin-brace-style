import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'tabWidth: 4',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];
