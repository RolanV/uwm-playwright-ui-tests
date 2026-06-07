import { test, expect } from "../../utilities/UITestUtils";
import { HomePage } from "../../pages/HomePage";


test.describe("US02 – Homepage Content @epic01 @regression", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("TC02 – Homebuyers section is present", async ({ page }) => {
    await expect(
      page
        .locator("h4, h3")
        .filter({ hasText: /Homebuyers/i })
        .first(),
    ).toBeVisible();
  });

  test("TC03 – Real Estate Agents section is present", async ({ page }) => {
    await expect(
      page
        .locator("h4, h3")
        .filter({ hasText: /Real Estate Agents/i })
        .first(),
    ).toBeVisible();
  });

  test("TC04 – Career Seekers section is present", async ({ page }) => {
    await expect(
      page
        .locator("h4, h3")
        .filter({ hasText: /Career Seekers/i })
        .first(),
    ).toBeVisible();
  });

  test("TC05 – Mortgage Brokers section is present", async ({ page }) => {
    await expect(
      page
        .locator("h4, h3")
        .filter({ hasText: /Mortgage Brokers/i })
        .first(),
    ).toBeVisible();
  });

  test("TC06 – Mortgage Matchup link exists for homebuyers", async ({
    page,
  }) => {
    const matchupLink = page.locator('a[href*="mortgagematchup.com"]').first();
    await expect(matchupLink).toBeVisible();
  });

  test("TC07 – Find Your Fit link points to uwmcareers.com", async ({
    page,
  }) => {
    const careerLink = page.locator('a[href*="uwmcareers.com"]').first();
    await expect(careerLink).toHaveAttribute("href", /uwmcareers\.com/);
  });

  test("TC09 – Page body contains UWM branding text", async ({ page }) => {
    await expect(page.locator("body")).toContainText(
      /United Wholesale Mortgage/i,
    );
  });

  test("TC10 – Page has no broken image (UWM logo visible)", async ({
    page,
  }) => {
    const logo = page.locator('img[alt*="UWM"]').first();
    await expect(logo).toBeVisible();
  });
});
