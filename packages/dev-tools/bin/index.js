#!/usr/bin/env node

const { resolve } = require("path");
const { createVirtualSymbolicLink, setProcessArgs } = require("../src/utils");
const script = process.argv[2];

switch (script) {
  case "storybook": {
    setProcessArgs([]);
    createVirtualSymbolicLink(require.resolve("../.storybook/main"), [
      resolve(process.cwd(), ".storybook/main.js"),
      resolve(process.cwd(), ".storybook/main"),
    ]);
    require("@storybook/react/bin");
    return;
  }
  case "test": {
    const jest = require("jest");
    const originalRun = jest.run;
    jest.run = function(args) {
      const configIndex = args.findIndex((arg) => arg === "--config") + 1;
      args[configIndex] = JSON.stringify({
        ...JSON.parse(args[configIndex]),
        ...require("../package.json").jest,
        setupFilesAfterEnv: [require.resolve("../src/setupTests")],
      });
      return originalRun.apply(this, arguments);
    };
    setProcessArgs(["test"]);
    require("react-scripts/scripts/test");
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
