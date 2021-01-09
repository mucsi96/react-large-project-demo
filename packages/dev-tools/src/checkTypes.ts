import { resolve } from "path";
import { setProcessArgs } from "./utils";

function checkTypes() {
  const tsConfig = resolve(__dirname, "../config/tsconfig.json");
  setProcessArgs(["--project", tsConfig]);

  require("typescript/lib/tsc");
}

export default checkTypes;
