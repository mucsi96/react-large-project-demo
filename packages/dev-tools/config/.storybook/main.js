const { relative } = require('path');
const craConfigOverrides = require('../cra-config-overrides');

const relativeBasePath = relative(__dirname, process.cwd()).replace(/\\/g, '/');

module.exports = {
  stories: [`${relativeBasePath}/src/**/*.stories.tsx`],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    {
      name: '@storybook/preset-create-react-app',
      options: {
        scriptsPackageName: 'react-scripts',
      },
    },
  ],
  webpackFinal(config) {
    return craConfigOverrides.webpack(config);
  },
};
