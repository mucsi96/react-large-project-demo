#!/usr/bin/env node
import buildLib from "./buildLib";
import checkTypes from "./checkTypes";
import storybook from "./storybook";

const command = process.argv[2];
const commandFunction = ({
  ["check-types"]: checkTypes,
  ["build-lib"]: buildLib,
  storybook,
} as Record<string, Function>)[command];

if (!commandFunction) {
  throw new Error(`Unsupported script ${command}`);
}

commandFunction();
