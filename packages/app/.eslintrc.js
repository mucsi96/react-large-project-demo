const { resolve } = require("path");

module.exports = {
  extends: require.resolve("dev-tools/config/.eslintrc.js"),
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: resolve(__dirname, "tsconfig.json"),
      },
    },
  ],
};
