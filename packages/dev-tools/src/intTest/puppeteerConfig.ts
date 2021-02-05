import { Browser, launch, Page } from 'puppeteer';
const context: { browser?: Browser; page?: Page } = {};

export async function startBrowser({
  headless,
}: {
  headless: boolean;
}): Promise<void> {
  context.browser = await launch({
    headless,
    args: ['--disable-gpu', '--no-sandbox'],
    timeout: process.env.DEBUG ? 0 : 60000,
  });
  const pages = await context.browser.pages();
  context.page = pages[0];
}

export async function stopBrowser(): Promise<void> {
  const pages = (await context.browser?.pages()) ?? [];
  await Promise.all(pages.map((page) => page.close()));
  await context.browser?.close();
}

export const page = new Proxy(
  {},
  {
    get: function (_target, name: string) {
      return ((context.page as unknown) as Record<string, Page>)[name];
    },
  }
) as Page;

export const browser = new Proxy(
  {},
  {
    get: function (_target, name: string) {
      return ((context.browser as unknown) as Record<string, Browser>)[name];
    },
  }
) as Browser;
