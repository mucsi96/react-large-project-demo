import { Compiler } from "webpack";

const { readFileSync } = require("fs");
const serviceWorker = readFileSync(require.resolve("./mockApiServiceWorker"), {
  encoding: "utf8",
});

// Source: https://webpack.js.org/contribute/writing-a-plugin/#example
export class MockApiServiceWorkerWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      "MockApiServiceWorkerWebpackPlugin",
      (compilation, callback) => {
        compilation.assets["mockApiServiceWorker.js"] = {
          source: () => serviceWorker,
          size: () => serviceWorker.length,
        };

        callback();
      }
    );
  }
}
