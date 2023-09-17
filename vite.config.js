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
  ],
});
