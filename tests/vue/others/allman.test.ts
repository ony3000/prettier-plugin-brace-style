import { describe, expect, test } from 'vitest';

import { format, baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  braceStyle: 'allman',
};

describe('vue/others/allman', () => {
  test('tabWidth: 4', () => {
    const input = `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`;
    const output = `<script setup lang="ts">\nif (foo)\n{\n    bar();\n}\nelse\n{\n    baz();\n}\n</script>\n\n<template>\n    <button\n        type="button"\n        @click="\n            () =>\n            {\n                if (foo)\n                {\n                    bar();\n                }\n                else\n                {\n                    baz();\n                }\n            }\n        "\n    >\n        Click Me\n    </button>\n</template>\n`;

    expect(format(input, { ...options, tabWidth: 4 })).toBe(output);
  });

  test('useTabs: true', () => {
    const input = `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`;
    const output = `<script setup lang="ts">\nif (foo)\n{\n\tbar();\n}\nelse\n{\n\tbaz();\n}\n</script>\n\n<template>\n\t<button\n\t\ttype="button"\n\t\t@click="\n\t\t\t() =>\n\t\t\t{\n\t\t\t\tif (foo)\n\t\t\t\t{\n\t\t\t\t\tbar();\n\t\t\t\t}\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\tbaz();\n\t\t\t\t}\n\t\t\t}\n\t\t"\n\t>\n\t\tClick Me\n\t</button>\n</template>\n`;

    expect(format(input, { ...options, useTabs: true })).toBe(output);
  });

  test('endOfLine: crlf', () => {
    const input = `\n<script setup lang="ts">\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n</script>\n\n<template>\n  <button\n    type="button"\n    @click="() => {\nif (foo) {\n  bar();\n}\nelse {\n  baz();\n}\n    }"\n  >\n    Click Me\n  </button>\n</template>\n`;
    const output = `<script setup lang="ts">\r\nif (foo)\r\n{\r\n  bar();\r\n}\r\nelse\r\n{\r\n  baz();\r\n}\r\n</script>\r\n\r\n<template>\r\n  <button\r\n    type="button"\r\n    @click="\r\n      () =>\r\n      {\r\n        if (foo)\r\n        {\r\n          bar();\r\n        }\r\n        else\r\n        {\r\n          baz();\r\n        }\r\n      }\r\n    "\r\n  >\r\n    Click Me\r\n  </button>\r\n</template>\r\n`;

    expect(format(input, { ...options, endOfLine: 'crlf' })).toBe(output);
  });
});
