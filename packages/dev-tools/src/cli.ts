#!/usr/bin/env node
import del from "del";
import { resolve } from "path";
import { pickCommand, runPackageBinary, runReactScripts } from "./utils";

function checkTypes() {
  runPackageBinary({
    packageName: "typescript",
    binaryName: "tsc",
    args: [],
  });
}

function lint() {
  runPackageBinary({
    packageName: "eslint",
    binaryName: "eslint",
    args: ["src"],
  });
}

function test() {
  runReactScripts(
    "test",
    process.argv.includes("--watch") ? [] : ["--watchAll=false"]
  );
}

function storybook() {
  runPackageBinary({
    packageName: "@storybook/react",
    binaryName: "start-storybook",
    args: ["--config-dir", resolve(__dirname, "../config/.storybook")],
  });
}

function start() {
  runReactScripts("start");
}

function buildLib() {
  del.sync([resolve(process.cwd(), "dist")]);

  runPackageBinary({
    packageName: "rollup",
    binaryName: "rollup",
    args: ["--config", resolve(__dirname, "../config/rollup.config.js")],
  });
}

function build() {
  runReactScripts("build");
}

pickCommand(
  {
    ["check-types"]: checkTypes,
    lint,
    test,
    storybook,
    start,
    ["build-lib"]: buildLib,
    build,
  },
  process.argv[2]
);
