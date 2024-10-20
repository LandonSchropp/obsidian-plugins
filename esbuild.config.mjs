import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "node:module";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE. If you's like to view the source, please visit the GitHub
repository of this plugin.
*/\n`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: [
    "plugins/cleaner/main.ts",
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
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outdir: "dist",
  minify: prod,
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
