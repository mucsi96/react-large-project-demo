import { resolve } from "path";
import { setProcessArgs } from "./utils";

function storybook() {
  const configDir = resolve(__dirname, "../config/.storybook");
  setProcessArgs(["--config-dir", configDir]);

  require("@storybook/react/bin");
}

export default storybook;
