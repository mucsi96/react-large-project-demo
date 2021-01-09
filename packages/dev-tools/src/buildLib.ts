import { resolve } from "path";
import { setProcessArgs } from "./utils";

function build() {
  const tsConfig = resolve(__dirname, "../config/tsconfig.build.json");
  setProcessArgs(["--project", tsConfig]);

  require("typescript/lib/tsc");
}

export default build;
