#!/usr/bin/env node

const { resolve } = require("path");
const { createVirtualSymbolicLink, setProcessArgs } = require("../src/utils");
const script = process.argv[2];

switch (script) {
  case "storybook": {
    const customPresets = require("@storybook/core/dist/server/common/custom-presets.js");
    customPresets.default = () => [require.resolve("../.storybook/main")];
    setProcessArgs([]);
    require("@storybook/react/bin");
    return;
  }
  case "test": {
    setProcessArgs([
      "test",
      "--config-overrides",
      require.resolve("../config-overrides"),
    ]);
    require("react-app-rewired/bin");
    return;
  }
  case "build": {
    const tsConfig = resolve(process.cwd(), "tsconfig.build.json");
    setProcessArgs(["--project", tsConfig]);
    createVirtualSymbolicLink(
      require.resolve("../tsconfig.build.json"),
      tsConfig
    );
    require("typescript/lib/tsc");
    return;
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
