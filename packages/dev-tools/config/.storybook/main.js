const { relative } = require("path");

const relativeBasePath = relative(__dirname, process.cwd()).replace(/\\/g, "/");

module.exports = {
  stories: [`${relativeBasePath}/src/**/*.stories.tsx`],
  addons: ["@storybook/addon-essentials", "@storybook/addon-links"],
};
