import { Browser, launch, Page } from "puppeteer";
import "./snapshot";

const context: { browser?: Browser; page?: Page } = {};

export async function start() {
  context.browser = await launch({
    headless: false,
    args: ["--disable-gpu", "--no-sandbox"],
    timeout: process.env.DEBUG ? 0 : 60000,
  });
  const pages = await context.browser.pages();
  context.page = pages[0];
}

export async function stop() {
  const pages = (await context.browser?.pages()) ?? [];
  await Promise.all(pages.map((page) => page.close()));
  await context.browser?.close();
}

export const page = new Proxy(
  {},
  {
    get: function (_target, name) {
      return (context.page as any)[name];
    },
  }
) as Page;

export const browser = new Proxy(
  {},
  {
    get: function (_target, name) {
      return (context.browser as any)[name];
    },
  }
) as Browser;

export * from "@cucumber/cucumber";
export { getDataSnapshot } from "./dataSnapshot";
