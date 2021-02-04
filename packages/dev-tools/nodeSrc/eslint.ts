import { resolve } from 'path';

const eslintConfig = resolve(__dirname, '../config/.eslintrc.json');

function getESlintConfig(root: string): Record<string, unknown> {
  return {
    extends: eslintConfig,
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parserOptions: {
          project: resolve(root, 'tsconfig.json'),
        },
      },
    ],
  };
}

export default getESlintConfig;
