import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  braceStyle: 'allman',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\nif (foo)\n{\n    bar();\n}\nelse\n{\n    baz();\n}\n</script>\n\n<template>\n    <button\n        type="button"\n        @click="\n            () =>\n            {\n                if (foo)\n                {\n                    bar();\n                }\n                else\n                {\n                    baz();\n                }\n            }\n        "\n    >\n        Click Me\n    </button>\n</template>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\nif (foo)\n{\n\tbar();\n}\nelse\n{\n\tbaz();\n}\n</script>\n\n<template>\n\t<button\n\t\ttype="button"\n\t\t@click="\n\t\t\t() =>\n\t\t\t{\n\t\t\t\tif (foo)\n\t\t\t\t{\n\t\t\t\t\tbar();\n\t\t\t\t}\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\tbaz();\n\t\t\t\t}\n\t\t\t}\n\t\t"\n\t>\n\t\tClick Me\n\t</button>\n</template>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`,
    output: `<script setup lang="ts">\r\nif (foo)\r\n{\r\n  bar();\r\n}\r\nelse\r\n{\r\n  baz();\r\n}\r\n</script>\r\n\r\n<template>\r\n  <button\r\n    type="button"\r\n    @click="\r\n      () =>\r\n      {\r\n        if (foo)\r\n        {\r\n          bar();\r\n        }\r\n        else\r\n        {\r\n          baz();\r\n        }\r\n      }\r\n    "\r\n  >\r\n    Click Me\r\n  </button>\r\n</template>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('vue/others/allman', () => {
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
