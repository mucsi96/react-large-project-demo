import del from "del";
import { resolve } from "path";
import { setProcessArgs } from "./utils";

function build() {
  if (!process.argv.includes("--watch")) {
    del.sync([resolve(process.cwd(), "dist")]);
  }
  const config = resolve(__dirname, "../config/rollup.config.js");
  setProcessArgs(["--config", config]);

  require("rollup/dist/bin/rollup");
}

export default build;
