import { unlink } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/v2-plugin.ts'), resolve(__dirname, 'src/v3-plugin.ts')],
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'cjs' ? '.cjs' : '.js';

        switch (entryName) {
          case 'v3-plugin':
            return `prettier3-plugin-brace-style${extension}`;
          case 'v2-plugin':
          default:
            return `prettier-plugin-brace-style${extension}`;
        }
      },
    },
    rollupOptions: {
      external: [/^prettier/, 'path', 'worker_threads'],
      output: {
        globals: {
          prettier: 'prettier',
        },
      },
    },
  },
  plugins: [
    dts({
      include: ['src/**'],
    }),
    {
      name: 'post-build-script',
      writeBundle: {
        sequential: true,
        order: 'post',
        handler: async (error) => {
          unlink(resolve(__dirname, 'dist/prettier-plugin-brace-style.js'), (_) => {
            // nothing to do
          });
          unlink(resolve(__dirname, 'dist/prettier3-plugin-brace-style.cjs'), (_) => {
            // nothing to do
          });
        },
      },
    },
  ],
});
