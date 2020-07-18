#!/usr/bin/env node

const script = process.argv[2];

switch (script) {
  case "start": {
    require("./start");
    return;
  }
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
  case "build-lib": {
    require("./buildLib");
    return;
  }
  case "check-types": {
    require("./checkTypes");
    return;
  }
  case "lint": {
    require("./lint");
    return;
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
