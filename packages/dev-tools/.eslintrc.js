const { resolve } = require('path');

module.exports = {
  extends: resolve(__dirname, 'config/.eslintrc.json'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: [
          resolve(__dirname, 'tsconfig.json'),
          resolve(__dirname, 'sw/tsconfig.json'),
        ],
      },
    },
  ],
};
