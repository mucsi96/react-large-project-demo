const { eslintConfig, setupEslintParser } = require("dev-tools");

module.exports = {
  extends: eslintConfig,
  overrides: [setupEslintParser(__dirname)],
};
