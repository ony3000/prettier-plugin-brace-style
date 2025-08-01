import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/index';

import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: '1tbs',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\nif (foo) {\n    bar();\n} else {\n    baz();\n}\n</script>\n\n<template>\n    <button\n        type="button"\n        @click="\n            () => {\n                if (foo) {\n                    bar();\n                } else {\n                    baz();\n                }\n            }\n        "\n    >\n        Click Me\n    </button>\n</template>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\nif (foo) {\n\tbar();\n} else {\n\tbaz();\n}\n</script>\n\n<template>\n\t<button\n\t\ttype="button"\n\t\t@click="\n\t\t\t() => {\n\t\t\t\tif (foo) {\n\t\t\t\t\tbar();\n\t\t\t\t} else {\n\t\t\t\t\tbaz();\n\t\t\t\t}\n\t\t\t}\n\t\t"\n\t>\n\t\tClick Me\n\t</button>\n</template>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\r\nif (foo) {\r\n  bar();\r\n} else {\r\n  baz();\r\n}\r\n</script>\r\n\r\n<template>\r\n  <button\r\n    type="button"\r\n    @click="\r\n      () => {\r\n        if (foo) {\r\n          bar();\r\n        } else {\r\n          baz();\r\n        }\r\n      }\r\n    "\r\n  >\r\n    Click Me\r\n  </button>\r\n</template>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('vue/others/1tbs', () => {
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
