import { runPackageBinary } from "./utils";

function checkTypes() {
  runPackageBinary({
    packageName: "typescript",
    binaryName: "tsc",
    args: [],
  });
}

export default checkTypes;
