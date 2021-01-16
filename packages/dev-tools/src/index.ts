import { resolve } from "path";

export const eslintConfig = resolve(__dirname, "../config/.eslintrc.json");

export function setupEslintParser(root: string) {
  return {
    files: ["*.ts", "*.tsx"],
    parserOptions: {
      project: resolve(root, "tsconfig.json"),
    },
  };
}

export * from "./mockApi";
