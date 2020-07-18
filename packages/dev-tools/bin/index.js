#!/usr/bin/env node

const script = process.argv[2];

switch (script) {
  case "storybook": {
    require("./storybook");
    return;
  }
  case "test": {
    require("./test");
    return;
  }
  case "build": {
    require("./build");
    return;
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
