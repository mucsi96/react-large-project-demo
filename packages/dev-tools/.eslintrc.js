module.exports = {
  extends: "./config/.eslintrc.json",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
