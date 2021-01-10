import del from "del";
import { resolve } from "path";
import { runPackageBinary } from "./utils";

function build() {
  del.sync([resolve(process.cwd(), "dist")]);

  runPackageBinary({
    packageName: "rollup",
    binaryName: "rollup",
    args: ["--config", resolve(__dirname, "../config/rollup.config.js")],
  });
}

export default build;
