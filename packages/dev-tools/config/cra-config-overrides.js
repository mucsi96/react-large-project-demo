const { resolve } = require('path');
const { MockApiServiceWorkerWebpackPlugin } = require('../lib');
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
        ...(process.env.REACT_APP_USE_MOCK_API === 'true'
          ? [new MockApiServiceWorkerWebpackPlugin()]
          : []),
      ].filter((plugin) => !(plugin instanceof ESLintPlugin)),
    };

    return overridenConfig;
  },
  paths: function (paths, env) {
    if (env !== 'production') {
      return paths;
    }

    const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true';
    return {
      ...paths,
      appBuild: resolve(
        __dirname,
        '../../../dist',
        useMockApi ? 'app-mock' : 'app-prod'
      ),
    };
  },
};
