import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";

const buildPath = "dist";

const commonPaths = {
  "@gi-ts/adw1": "gi://Adw",
  "@gi-ts/gtk4": "gi://Gtk?version=4.0",
  "@gi-types/gvc1": "gi://Gvc",
  "@gi-ts/glib2": "gi://GLib",
  "@gi-ts/gio2": "gi://Gio",
  "gi://Meta?version=14": "gi://Meta",
  "@gi-ts/clutter1": "gi://Clutter",
  "@gi-ts/gobject2": "gi://GObject",
};

const extensionPaths = {
  ...commonPaths,
  "gnomejs://extension.js":
    "resource:///org/gnome/shell/extensions/extension.js",
  "gnomejs://main.js": "resource:///org/gnome/shell/ui/main.js",
  "gnomejs://volume.js": "resource:///org/gnome/shell/ui/status/volume.js",
  "gnomejs://layout.js": "resource:///org/gnome/shell/ui/layout.js",
};

export default [
  {
    input: "src/extension.ts",
    treeshake: {
      moduleSideEffects: "no-external",
    },
    output: {
      file: `${buildPath}/extension.js`,
      format: "es",
      name: "init",
      exports: "default",
      paths: extensionPaths,
      assetFileNames: "[name][extname]",
    },
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: false,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      // styles({
      //   mode: ["extract", `stylesheet.css`],
      // }),
      copy({
        targets: [
          { src: "./resources/metadata.json", dest: `${buildPath}` },
          { src: "./resources/schemas", dest: `${buildPath}` },
          { src: "./src/dummy-window/*", dest: `${buildPath}` },
        ],
      }),
      cleanup({
        comments: "none",
      }),
    ],
  },
];
