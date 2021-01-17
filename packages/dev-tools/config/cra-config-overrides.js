const { resolve } = require("path");

module.exports = {
  jest: function (config) {
    return {
      ...config,
      setupFilesAfterEnv: [resolve(__dirname, "jest.setup.js")],
      snapshotSerializers: ["enzyme-to-json/serializer"],
      testMatch: ["<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
    };
  },
};
