import {
  AfterAll,
  AfterStep,
  BeforeAll,
  BeforeStep,
  IWorldOptions,
  setDefaultTimeout,
  Status,
} from "@cucumber/cucumber";
import { messages } from "@cucumber/messages";
import { readFileSync } from "fs";
import { basename, resolve } from "path";
import { page, start, stop } from ".";

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
    .replace(/[:\-Z]/g, "")
    .replace(/[T.]/g, "-");
  const fileName = [
    currentPickle.uri && basename(currentPickle.uri, ".feature"),
    datestamp,
  ]
    .filter(Boolean)
    .join("-");

  return resolve(process.cwd(), `screenshots/${fileName}.png`);
}

BeforeAll(async () => {
  await start();
});

AfterAll(async () => {
  await stop();
});

BeforeStep(({ pickle }) => {
  currentPickle = pickle;
});

AfterStep(async function (this: IWorldOptions, { result }) {
  if (result.status === Status.FAILED) {
    const path = getScreenshotName();
    await page.screenshot({
      path,
    });
    await this.attach(readFileSync(path), "image/png");
  }
});

export function getTestContext(): {
  fileName: string;
  testName: string;
} {
  return {
    fileName: currentPickle.uri!,
    testName: currentPickle.name!,
  };
}
