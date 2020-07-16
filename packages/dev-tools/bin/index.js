#!/usr/bin/env node
const script = process.argv[2];
const { resolve } = require("path");

switch (script) {
  case "storybook": {
    require("@storybook/react/bin");
    return;
  }
  case "test": {
    process.argv = [
      process.argv[0],
      process.argv[1],
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
