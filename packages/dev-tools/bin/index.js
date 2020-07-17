#!/usr/bin/env node

const { resolve } = require("path");
const fs = require("fs");

const script = process.argv[2];
const restArgs = process.argv.slice(3);

function setProcessArgs(args) {
  process.argv = [process.argv[0], process.argv[1], ...args, ...restArgs];
}

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
    setProcessArgs(["--project", resolve(process.cwd(), "tsconfig.json")]);
    console.log(process.argv);
    const originalReadFile = fs.readFileSync;
    fs.readFileSync = (fileName, encoding) => {
      if (fileName.endsWith("/tsconfig.json")) {
        const config = JSON.parse(originalReadFile(fileName, encoding));

        return JSON.stringify({
          ...config,
          exclude: ["**/*.stories.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
          compilerOptions: {
            ...config.compilerOptions,
            declaration: true,
            noEmit: false,
            outDir: "dist",
          },
        });
      }
      return originalReadFile(fileName, encoding);
    };
    require("typescript/lib/tsc");
    return;
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
