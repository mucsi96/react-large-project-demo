const { resolve } = require("path");
const { setProcessArgs, createVirtualSymbolicLink } = require("../src/utils");

const tsConfig = resolve(process.cwd(), "tsconfig.build.json");

setProcessArgs(["--project", tsConfig]);

createVirtualSymbolicLink(require.resolve("../tsconfig.build.json"), tsConfig);

require("typescript/lib/tsc");
