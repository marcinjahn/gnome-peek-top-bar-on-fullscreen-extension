import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";
import styles from "rollup-plugin-styles";

const buildPath = "dist";

const globals = {
  "@gi-types/gvc1": "imports.gi.Gvc",
  "@gi-ts/gtk4": "imports.gi.Gtk",
  "@gi-ts/gio2": "imports.gi.Gio",
  "@gi-ts/adw1": "imports.gi.Adw",
  "@gi-ts/glib2": "imports.gi.GLib",
  "@gi-ts/clutter1": "imports.gi.Clutter",
  "@gi-ts/gobject2": "imports.gi.GObject",
};

const external = [...Object.keys(globals)];

export default [
  {
    input: "src/extension.ts",
    treeshake: {
      moduleSideEffects: "no-external",
    },
    output: {
      file: `${buildPath}/extension.js`,
      format: "iife",
      name: "init",
      exports: "default",
      globals,
      assetFileNames: "[name][extname]",
    },
    external,
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: false,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      styles({
        mode: ["extract", `stylesheet.css`],
      }),
      copy({
        targets: [
          { src: "./resources/metadata.json", dest: `${buildPath}` },
          { src: "./resources/schemas", dest: `${buildPath}` },
          { src: "./src/dummy-window/dummy-window.js", dest: `${buildPath}` },
        ],
      }),
      cleanup({
        comments: "none",
      }),
    ],
  },
];
