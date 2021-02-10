const { resolve, relative } = require('path');
const {
  MockApiServiceWorkerWebpackPlugin,
} = require('../lib/mockApi/MockApiServiceWorkerWebpackPlugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true';
const prodDistPath = resolve(
  __dirname,
  '../../../dist',
  useMockApi ? 'app-mock' : 'app-prod'
);

module.exports = {
  jest: function (config) {
    return {
      ...config,
      setupFilesAfterEnv: [resolve(__dirname, 'jest.setup.js')],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    };
  },
  webpack: function (config, env) {
    const overridenConfig = {
      ...config,
      plugins: [
        ...config.plugins,
        ...(useMockApi ? [new MockApiServiceWorkerWebpackPlugin()] : []),
        ...(env === 'production' && [
          new StatsWriterPlugin({
            filename: relative(
              prodDistPath,
              resolve(process.cwd(), 'reports/log.json')
            ),
            fields: null,
            stats: { chunkModules: true },
          }),
          new Visualizer({
            filename: relative(
              prodDistPath,
              resolve(process.cwd(), 'reports/statistics.html')
            ),
          }),
        ]),
      ].filter((plugin) => !(plugin instanceof ESLintPlugin)),
    };

    return overridenConfig;
  },
  paths: function (paths, env) {
    if (env !== 'production') {
      return paths;
    }

    return {
      ...paths,
      appBuild: prodDistPath,
    };
  },
};
