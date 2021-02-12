# dev-tools

## TypeScript configuration

```json
{
  "extends": "dev-tools/config/tsconfig.json",
  "include": ["src"]
}
```

## ESLint configuration

```js
module.exports = require('dev-tools/eslint').default(__dirname);
```

## CLI

### dev-tools check-types

Runs TypeScript with no emit based on project `tsconfig.json`

### dev-tools lint

Runs ESLint based on project `.eslintrc`. If `--max-warnings` is not provided sets `--max-warnings 0` which disallows any warning.

### dev-tools test

Runs Jest based on CRA setup + mock API support

### dev-tools int-test

Run Cucumber with Puppetier

### dev-tools start-storybook

Starts storybook on current folder with matching pattern `./src/**/*.stories.tsx` for stories.
Integrated support for mock API.
Webpack setup is based on CRA

### dev-tools start-app

Runs CRA start

### dev-tools build-lib

Runs rollup with marking every dependency as external.

### dev-tools build-storybook

Builds storybook on current folder with matching pattern `./src/**/*.stories.tsx` for stories.
Integrated support for mock API.
Webpack setup is based on CRA

### dev-tools build-app

Runs CRA build

## Integration testing

Based on Cucumber and Puppetier

Additional features

- snapshot testing

Example:

```
Feature: Friend List

    Feature Description

    Scenario: Show the list of friends
    Given I open the friends list
    Then I see the list of friends

    Scenario: Show empty message if there are no friends
    Given I have no friends
    And I open the friends list
    Then I see "No friends found :(" message

    Scenario: Show error message if fetching friends fails
    Given The friends endpoint fails
    And I open the friends list
    Then I see "We couldn't process your request at this time Status: 500" message
```

```ts
import {
  getDataSnapshot,
  Given,
  page,
  Then,
  BaseWorld as World,
} from 'dev-tools/intTest';
import expect from 'expect';

Given('I have no friends', function (this: World) {
  this.setMockSwitch('friends', 'EMPTY');
});

Given('The friends endpoint fails', function (this: World) {
  this.setMockSwitch('friends', 'LOADING_FAILURE');
});

Given('I open the friends list', async function (this: World) {
  await page.goto(this.getStoryUrl('friendslist--normal'));
});

Then('I see the list of friends', async () => {
  await page.waitForSelector('[data-name="friend-list"] [data-name="friend"]');
  expect(await getDataSnapshot('[data-name="friend-list"]')).toMatchSnapshot();
});

Then('I see {string} message', async (message: string) => {
  await page.waitForFunction(
    `document.querySelector("body").innerText.includes("${message}")`
  );
});
```
