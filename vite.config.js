import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PrettierPluginBraceStyle',
      fileName: 'prettier-plugin-brace-style',
    },
    rollupOptions: {
      external: [/^prettier/],
      output: {
        globals: {
          prettier: 'prettier',
        },
      },
    },
  },
});
