import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { dirname, isAbsolute, relative } from 'path';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';

const relativeBasePath = relative(__dirname, process.cwd()).replace(/\\/g, '/');
const {
  main,
  module,
  types,
  peerDependencies,
  dependencies,
  devDependencies,
} = require(`${relativeBasePath}/package.json`);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const externals = Object.keys({
  ...peerDependencies,
  ...dependencies,
  ...devDependencies,
});

function isExternal(id) {
  if (id.startsWith('.')) {
    return false;
  }

  const relativeId = isAbsolute(id) ? relative(process.cwd(), id) : id;

  if (isAbsolute(id) && relativeId.startsWith('..')) {
    return true;
  }

  const packageName = relativeId.split('/')[0];

  return externals.includes(packageName);
}

const config = {
  input: 'src',
  output: [
    {
      file: main,
      format: 'cjs',
    },
    {
      dir: dirname(module),
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  external: isExternal,
  plugins: [
    typescript({
      exclude: [
        '**/*.stories.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        './test/**/*',
      ],
      declaration: true,
      declarationDir: dirname(types),
      rootDir: 'src',
      module: 'ESNext',
    }),
    postcss(),
    resolve({
      extensions,
    }),
    commonjs(),
    url(),
    svgr(),
    visualizer({
      filename: `reports/build-stats.html`,
    }),
  ],
};

export default config;
