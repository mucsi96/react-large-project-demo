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
  if (process.env.DIST_DIR) {
    await startDistServer(process.env.DIST_DIR);
  }
  await startBrowser();
});

AfterAll(async () => {
  await stopBrowser();
  if (process.env.DIST_DIR) {
    await stopDistServer();
  }
});

BeforeStep(({ pickle }) => {
  currentPickle = pickle;
});

AfterStep(function (this: IWorldOptions, { result }) {
  if (result.status === Status.FAILED) {
    const path = getScreenshotName();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    page
      .screenshot({
        path,
      })
      .then(() => this.attach(readFileSync(path), 'image/png'));
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
