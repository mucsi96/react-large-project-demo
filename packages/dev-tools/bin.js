#!/usr/bin/env node

const {
  checkTypes,
  lint,
  test,
  intTest,
  startStorybook,
  startApp,
  buildLib,
  buildStorybook,
  buildApp,
  pickCommand,
} = require('./lib/index.cjs');

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
