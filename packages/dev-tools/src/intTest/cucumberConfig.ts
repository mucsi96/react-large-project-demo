import {
  AfterAll,
  AfterStep,
  BeforeAll,
  BeforeStep,
  IWorldOptions,
  setDefaultTimeout,
  Status,
} from '@cucumber/cucumber';
import { messages } from '@cucumber/messages';
import { readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { page, startBrowser, stopBrowser } from './puppeteerConfig';
import { startDistServer, stopDistServer } from './distServer';
import { sync as mkdirpSync } from 'mkdirp';

const distDir = process.env.DIST_DIR;
let currentPickle: messages.IPickle;

if (process.env.DEBUG) {
  setDefaultTimeout(-1);
} else {
  setDefaultTimeout(90000);
}

function getScreenshotName() {
  const date = new Date();
  const datestamp = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/[:\-Z]/g, '')
    .replace(/[T.]/g, '-');
  const fileName = [
    currentPickle.uri && basename(currentPickle.uri, '.feature'),
    datestamp,
  ]
    .filter(Boolean)
    .join('-');

  return resolve(process.cwd(), `screenshots/${fileName}.png`);
}

BeforeAll(async () => {
  mkdirpSync(resolve(process.cwd(), 'screenshots'));
  if (distDir) {
    await startDistServer({ distDir });
  }
  await startBrowser({ headless: !!distDir });
});

AfterAll(async () => {
  await stopBrowser();
  if (distDir) {
    await stopDistServer();
  }
});

BeforeStep(({ pickle }) => {
  currentPickle = pickle;
});

AfterStep(function (this: IWorldOptions, { result }) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const world = this;
  if (result.status === Status.FAILED) {
    const path = getScreenshotName();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    page
      .screenshot({
        path,
      })
      .then(() => world.attach(readFileSync(path), 'image/png'));
  }
});

export function getTestContext(): {
  fileName?: string | null;
  testName?: string | null;
} {
  return {
    fileName: currentPickle.uri,
    testName: currentPickle.name,
  };
}
