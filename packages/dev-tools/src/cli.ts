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
    args: [
      "src",
      ...(process.argv.includes("--max-warnings")
        ? []
        : ["--max-warnings", "0"]),
    ],
  });
}

function test() {
  runReactScripts(
    "test",
    process.argv.includes("--watch") ? [] : ["--watchAll=false"]
  );
}

function intTest() {
  if (process.argv.includes("--update")) {
    process.env.SNAPSHOT_UPDATE = "true";
  }

  if (process.argv.includes("--debug")) {
    process.env.DEBUG = "true";
  }

  process.argv = process.argv.filter(
    (arg) => !["--update", "--debug"].includes(arg)
  );

  runPackageBinary({
    packageName: "@cucumber/cucumber",
    binaryName: "cucumber-js",
    args: [
      "--require-module",
      "dev-tools/lib/intTest/enableTypeScript",
      "--require",
      "dev-tools/lib/intTest/cucumberConfig",
      "--require",
      "test/stepDefinitions/**/*.ts",
      "--publish-quiet",
      "--format",
      "progress",
      "--format",
      "html:reports/cucumber_report.html",
      "test/features/**/*.feature",
    ],
  });
}

function storybook() {
  runPackageBinary({
    packageName: "@storybook/react",
    binaryName: "start-storybook",
    args: [
      "--config-dir",
      resolve(__dirname, "../config/.storybook"),
      "--port",
      "9009",
    ],
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
    "check-types": checkTypes,
    lint,
    test,
    "int-test": intTest,
    storybook,
    start,
    "build-lib": buildLib,
    build,
  },
  process.argv[2]
);
