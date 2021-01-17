import { Given, page } from "dev-tools/lib/intTest";

Given("I am on the page", async () => {
  await page.goto(
    "http://localhost:9009/iframe.html?id=friendslist--with-text",
    { waitUntil: "networkidle0" }
  );
});
