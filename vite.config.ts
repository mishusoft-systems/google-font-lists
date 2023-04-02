import * as path from 'path';
import { defineConfig } from 'vite';


import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

export default defineConfig({
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'google-font-lists',
      fileName: 'index',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['node:path','node:fs'],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
});
