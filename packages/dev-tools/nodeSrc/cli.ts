import del from 'del';
import { basename, resolve } from 'path';
import { pickCommand, runPackageBinary, runReactScripts } from './utils';

export function checkTypes(): void {
  runPackageBinary({
    packageName: 'typescript',
    binaryName: 'tsc',
    args: [],
  });
}

export function lint(): void {
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

export function test(): void {
  runReactScripts(
    'test',
    process.argv.includes('--watch') ? [] : ['--watchAll=false']
  );
}

export function intTest(): void {
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
      'dev-tools/intTest/enableTypeScript',
      '--require',
      'dev-tools/intTest/cucumberConfig',
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

export function startStorybook(): void {
  process.env.REACT_APP_USE_MOCK_API = 'true';

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

export function startApp(): void {
  process.env.REACT_APP_USE_MOCK_API = 'true';

  runReactScripts('start');
}

export function buildLib(): void {
  if (!process.argv.includes('--watch')) {
    del.sync([resolve(process.cwd(), 'lib')]);
  }

  runPackageBinary({
    packageName: 'rollup',
    binaryName: 'rollup',
    args: ['--config', resolve(__dirname, '../config/rollup.config.js')],
  });
}

export function buildStorybook(): void {
  process.env.REACT_APP_USE_MOCK_API = 'true';

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

export function buildApp(): void {
  const useMockApi = process.argv.includes('--use-mock-api');
  process.argv = process.argv.filter((arg) => arg !== '--use-mock-api');

  if (useMockApi) {
    process.env.REACT_APP_USE_MOCK_API = 'true';
    process.env.PUBLIC_URL = '/react-large-project-demo/app-mock';
  } else {
    process.env.REACT_APP_USE_MOCK_API = 'false';
    process.env.PUBLIC_URL = '/react-large-project-demo/app-prod';
  }

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
