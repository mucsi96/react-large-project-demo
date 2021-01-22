import del from 'del';
import { basename, resolve } from 'path';
import { pickCommand, runPackageBinary, runReactScripts } from './utils';

function checkTypes() {
  runPackageBinary({
    packageName: 'typescript',
    binaryName: 'tsc',
    args: [],
  });
}

function lint() {
  runPackageBinary({
    packageName: 'eslint',
    binaryName: 'eslint',
    args: [
      'src',
      ...(process.argv.includes('--max-warnings')
        ? []
        : ['--max-warnings', '0']),
    ],
  });
}

function test() {
  runReactScripts(
    'test',
    process.argv.includes('--watch') ? [] : ['--watchAll=false']
  );
}

function intTest() {
  if (process.argv.includes('--update')) {
    process.env.SNAPSHOT_UPDATE = 'true';
  }

  if (process.argv.includes('--debug')) {
    process.env.DEBUG = 'true';
  }

  process.argv = process.argv.filter(
    (arg) => !['--update', '--debug'].includes(arg)
  );

  runPackageBinary({
    packageName: '@cucumber/cucumber',
    binaryName: 'cucumber-js',
    args: [
      '--require-module',
      'dev-tools/lib/intTest/enableTypeScript',
      '--require',
      'dev-tools/lib/intTest/cucumberConfig',
      '--require',
      'test/stepDefinitions/**/*.ts',
      '--publish-quiet',
      '--format',
      'progress',
      '--format',
      'html:reports/cucumber_report.html',
      'test/features/**/*.feature',
    ],
  });
}

function startStorybook() {
  runPackageBinary({
    packageName: '@storybook/react',
    binaryName: 'start-storybook',
    args: [
      '--config-dir',
      resolve(__dirname, '../config/.storybook'),
      '--port',
      '9009',
      '--host',
      'localhost',
    ],
  });
}

function startApp() {
  runReactScripts('start');
}

function buildLib() {
  if (!process.argv.includes('--watch')) {
    del.sync([resolve(process.cwd(), 'dist')]);
  }

  runPackageBinary({
    packageName: 'rollup',
    binaryName: 'rollup',
    args: ['--config', resolve(__dirname, '../config/rollup.config.js')],
  });
}

function buildStorybook() {
  runPackageBinary({
    packageName: '@storybook/react',
    binaryName: 'build-storybook',
    args: [
      '--config-dir',
      resolve(__dirname, '../config/.storybook'),
      '-o',
      resolve(__dirname, '../../../dist', basename(process.cwd())),
    ],
  });
}

function buildApp() {
  del.sync([resolve(process.cwd(), 'build')]);

  runReactScripts('build');
}

pickCommand(
  {
    'check-types': checkTypes,
    lint,
    test,
    'int-test': intTest,
    'start-storybook': startStorybook,
    'start-app': startApp,
    'build-lib': buildLib,
    'build-storybook': buildStorybook,
    'build-app': buildApp,
  },
  process.argv[2]
);
