/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "lib/figma.ts",
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
        const uiScriptPath = "./dist/assets/ui.js";
        const uiHtmlPath = "./dist/ui/index.html";

        const script = fs.readFileSync(uiScriptPath, "utf8", (_, data) => {
          return data;
        });

        const html = fs.readFileSync(uiHtmlPath, "utf8", (_, data) => {
          return data;
        });

        const replaced =
          html.replace(
            `<script type="module" crossorigin src="/assets/ui.js"></script>`,
            ""
          ) + `<script>${script}</script>`;

        fs.writeFileSync(uiHtmlPath, replaced, "utf8");
        fs.rmSync(uiScriptPath);
      },
    },
  ],
});
