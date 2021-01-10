import { resolve } from "path";
import { runPackageBinary } from "./utils";

function storybook() {
  runPackageBinary({
    packageName: "@storybook/react",
    binaryName: "start-storybook",
    args: ["--config-dir", resolve(__dirname, "../config/.storybook")],
  });
}

export default storybook;
