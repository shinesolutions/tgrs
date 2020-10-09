import "expect-puppeteer";

describe("home", () => {
  test("displays greeting", async () => {
    await page.goto(uriOrigin);
    await expect(page).toMatchElement(".App", { text: "Hello, John Doe!" });
  });
});
