const { resolve } = require('path');
const {
  MockApiServiceWorkerWebpackPlugin,
} = require('../lib/mockApi/MockApiServiceWorkerWebpackPlugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  jest: function (config) {
    return {
      ...config,
      setupFilesAfterEnv: [resolve(__dirname, 'jest.setup.js')],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    };
  },
  webpack: function (config) {
    const overridenConfig = {
      ...config,
      plugins: [
        ...config.plugins,
        new MockApiServiceWorkerWebpackPlugin(),
      ].filter((plugin) => !(plugin instanceof ESLintPlugin)),
    };

    return overridenConfig;
  },
};
