import { getDataSnapshot, page, Then } from "dev-tools/lib/intTest";
import expect from "expect";

Then("I see the list of friends", async () => {
  await page.waitForSelector("#root ul");
  expect(await getDataSnapshot("#root")).toMatchSnapshot();
});
