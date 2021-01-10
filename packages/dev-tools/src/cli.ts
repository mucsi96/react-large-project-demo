#!/usr/bin/env node
import del from "del";
import { resolve } from "path";
import { pickCommand, runPackageBinary } from "./utils";

function buildLib() {
  del.sync([resolve(process.cwd(), "dist")]);

  runPackageBinary({
    packageName: "rollup",
    binaryName: "rollup",
    args: ["--config", resolve(__dirname, "../config/rollup.config.js")],
  });
}

function checkTypes() {
  runPackageBinary({
    packageName: "typescript",
    binaryName: "tsc",
    args: [],
  });
}

function storybook() {
  runPackageBinary({
    packageName: "@storybook/react",
    binaryName: "start-storybook",
    args: ["--config-dir", resolve(__dirname, "../config/.storybook")],
  });
}

function test() {
  runPackageBinary({
    packageName: "react-app-rewired",
    binaryName: "react-app-rewired",
    args: [
      "test",
      "--config-overrides",
      resolve(__dirname, "../config/cra-config-overrides.js"),
      ...(process.argv.includes("--watch") ? [] : ["--watchAll=false"]),
    ],
  });
}

pickCommand(
  {
    ["check-types"]: checkTypes,
    ["build-lib"]: buildLib,
    storybook,
    test,
  },
  process.argv[2]
);
