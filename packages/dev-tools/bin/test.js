const jest = require("jest");
const { setProcessArgs } = require("../src/utils");

const originalRun = jest.run;

jest.run = function(args) {
  const configIndex = args.findIndex((arg) => arg === "--config") + 1;
  args[configIndex] = JSON.stringify({
    ...JSON.parse(args[configIndex]),
    ...require("../package.json").jest,
    setupFilesAfterEnv: [require.resolve("../src/setupTests")],
  });
  return originalRun.apply(this, arguments);
};

setProcessArgs(["test"]);

require("react-scripts/scripts/test");
