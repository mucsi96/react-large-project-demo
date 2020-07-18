const { setProcessArgs, createVirtualSymbolicLink } = require("../src/utils");
const { resolve } = require("path");

setProcessArgs([]);

createVirtualSymbolicLink(require.resolve("../.storybook/main"), [
  resolve(process.cwd(), ".storybook/main.js"),
  resolve(process.cwd(), ".storybook/main"),
]);

createVirtualSymbolicLink(
  resolve(__dirname, "../node_modules/.bin/react-scripts"),
  resolve(process.cwd(), "node_modules/.bin/react-scripts")
);

require("@storybook/react/bin");
