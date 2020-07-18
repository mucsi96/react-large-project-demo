const { setProcessArgs, createVirtualSymbolicLink } = require("../src/utils");
const { resolve } = require("path");
const getReactScriptsPath = require("@storybook/preset-create-react-app/dist/helpers/getReactScriptsPath");

setProcessArgs([]);

createVirtualSymbolicLink(require.resolve("../.storybook/main"), [
  resolve(process.cwd(), ".storybook/main.js"),
  resolve(process.cwd(), ".storybook/main"),
]);

getReactScriptsPath.getReactScriptsPath = () =>
  resolve(require.resolve("react-scripts/bin/react-scripts"), "../..");

require("@storybook/react/bin");
