import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "node:module";
import { join } from "path";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE. If you's like to view the source, please visit the GitHub
repository of this plugin.
*/\n`;

const isProduction = process.argv[2] === "production";

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: [
    "plugins/cleaner/main.ts",
    "plugins/extractor/main.ts",
    "plugins/list-item-deleter/main.ts",
    "plugins/task-forwarder/main.ts",
  ],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtinModules,
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: isProduction ? false : "inline",
  treeShaking: true,
  outdir: isProduction ? "dist" : join(process.env.OBSIDIAN_DEVELOPMENT_VAULT, ".obsidian/plugins"),
  minify: isProduction,
});

if (isProduction) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
