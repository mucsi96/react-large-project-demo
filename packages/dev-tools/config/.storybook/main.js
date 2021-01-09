const { resolve } = require("path");

module.exports = {
  stories: [resolve(process.cwd(), "src/**/*.stories.tsx")],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-actions",
    "@storybook/addon-links",
  ],
};
