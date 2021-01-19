import { resolve } from "path";
import { register } from "ts-node";

register({
  project: resolve(process.cwd(), "tsconfig.json"),
  compilerOptions: {
    module: "commonjs",
  },
});
