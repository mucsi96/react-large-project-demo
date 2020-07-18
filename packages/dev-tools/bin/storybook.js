const {
  setProcessArgs,
  createVirtualSymbolicLink,
  createVirtualFile,
} = require("../src/utils");
const { resolve, relative } = require("path");

setProcessArgs([]);

createVirtualSymbolicLink(require.resolve("../.storybook/main"), [
  resolve(process.cwd(), ".storybook/main.js"),
  resolve(process.cwd(), ".storybook/main"),
]);

createVirtualFile(
  resolve(process.cwd(), "node_modules/.bin/react-scripts"),
  `"$basedir\\${relative(
    resolve(process.cwd(), "node_modules/.bin"),
    require.resolve("react-scripts/bin/react-scripts")
  )}"`
);

require("@storybook/react/bin");
