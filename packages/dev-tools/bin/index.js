#!/usr/bin/env node
const script = process.argv[2];

switch (script) {
  case "storybook": {
    require("./storybook");
    return;
  }
  default: {
    throw new Error(`Unsupported script ${script}`);
  }
}
