const { setProcessArgs, createVirtualSymbolicLink } = require("../src/utils");
const { resolve } = require("path");

setProcessArgs([]);

createVirtualSymbolicLink(require.resolve("../.storybook/main"), [
  resolve(process.cwd(), ".storybook/main.js"),
  resolve(process.cwd(), ".storybook/main"),
]);

require("@storybook/react/bin");
