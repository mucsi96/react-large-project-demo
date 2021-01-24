import {
  getDataSnapshot,
  Given,
  page,
  Then,
  getStoryUrl,
} from 'dev-tools/intTest';
import { World } from '../support/world';
import expect from 'expect';

Given('I have no friends', function (this: World) {
  this.setMockSwitch('friends', 'empty');
});

Given('The friends endpoint fails', function (this: World) {
  this.setMockSwitch('friends', 'failure');
});

Given('I open the friends list', async function (this: World) {
  await page.goto(
    getStoryUrl(`friendslist--normal&${this.getMockSwitchesQueryParam()}`)
  );
});

Then('I see the list of friends', async () => {
  await page.waitForSelector('#root ul');
  expect(await getDataSnapshot('#root')).toMatchSnapshot();
});

Then('I see {string} message', async (message: string) => {
  await page.waitForFunction(
    `document.querySelector("body").innerText.includes("${message}")`
  );
});
