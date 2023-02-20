/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        figma: "lib/figma.ts",
        ui: "ui/index.html",
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [
    {
      name: "replace-script-inline",
      closeBundle: () => {
        const script = fs.readFileSync(
          "./dist/assets/ui.js",
          "utf8",
          (_, data) => {
            return data;
          }
        );

        const html = fs.readFileSync(
          "./dist/ui/index.html",
          "utf8",
          (_, data) => {
            return data;
          }
        );

        const replaced = html.replace(
          `<script type="module" crossorigin src="/assets/ui.js"></script>`,
          `<script>${script}</script>`
        );

        fs.writeFileSync("./dist/ui/index.html", replaced, "utf8");
      },
    },
  ],
});
