const { resolve } = require("path");
const {
  MockApiServiceWorkerWebpackPlugin,
} = require("../lib/mockApi/MockApiServiceWorkerWebpackPlugin");

module.exports = {
  jest: function (config) {
    return {
      ...config,
      setupFilesAfterEnv: [resolve(__dirname, "jest.setup.js")],
      snapshotSerializers: ["enzyme-to-json/serializer"],
      testMatch: ["<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
    };
  },
  webpack: function (config) {
    return {
      ...config,
      plugins: [...config.plugins, new MockApiServiceWorkerWebpackPlugin()],
    };
  },
};
