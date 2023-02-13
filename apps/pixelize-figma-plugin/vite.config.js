/** @type {import('vite').UserConfig} */

import { viteSingleFile } from "vite-plugin-singlefile";
export default {
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
};
