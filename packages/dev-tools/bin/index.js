#!/usr/bin/env node
const script = process.argv[2];
const { resolve } = require("path");

process.argv = [process.argv[0], process.argv[1]];

switch (script) {
  case "storybook": {
    const customPresets = require("@storybook/core/dist/server/common/custom-presets.js");
    customPresets.default = () => [require.resolve("../.storybook/main")];
    require("@storybook/react/bin");
    return;
  }
  case "test": {
    process.argv = [
      ...process.argv,
      "test",
      "--config-overrides",
      require.resolve("../config-overrides"),
    ];
    require("react-app-rewired/bin");
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
