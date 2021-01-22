const { eslintConfig, setupEslintParser } = require('dev-tools/eslint');

module.exports = {
  extends: eslintConfig,
  overrides: [setupEslintParser(__dirname)],
};
