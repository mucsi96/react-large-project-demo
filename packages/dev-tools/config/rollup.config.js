import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import { dirname, relative } from "path";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import visualizer from "rollup-plugin-visualizer";

const relativeBasePath = relative(__dirname, process.cwd()).replace(/\\/g, "/");
const packageJson = require(`${relativeBasePath}/package.json`);

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const config = {
  input: "src",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
    },
    {
      dir: dirname(packageJson.module),
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  ],
  plugins: [
    typescript({
      exclude: ["**/*.stories.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      declaration: true,
      declarationDir: dirname(packageJson.types),
      rootDir: "src",
    }),
    postcss(),
    external(),
    resolve({
      extensions,
    }),
    commonjs(),
    url(),
    svgr(),
    visualizer({
      filename: `reports/build-stats.html`,
    }),
  ],
};

export default config;
