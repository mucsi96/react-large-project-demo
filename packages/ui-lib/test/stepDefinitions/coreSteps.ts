import { Given, page } from 'dev-tools/intTest';

Given('I am on the page', async () => {
  await page.goto('http://localhost:9009/iframe.html?id=friendslist--normal');
});
