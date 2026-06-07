import { test, expect } from "../../utilities/UITestUtils";
import { HomePage } from "../../pages/HomePage";

/**
 * EPIC 01 – UWM Public Website
 * User Story 01 – Homepage Navigation & Core Elements
 */
test.describe("US01 – Homepage Navigation @epic01 @smoke", () => {

  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("TC01 – Page title contains UWM", async ({ page }) => {
    await expect(page).toHaveTitle(/UWM/i);
  });

  test("TC02 – URL is correct after load", async ({ page }) => {
    await expect(page).toHaveURL("https://www.uwm.com/");
  });

  test("TC03 – Hero H1 heading is visible", async ({ page }) => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test("TC04 – Hero H1 mentions home loans", async ({ page }) => {
    await expect(homePage.heroHeading).toContainText(/home loans/i);
  });

  test("TC05 – Loan Products nav link is visible", async ({ page }) => {
    await expect(homePage.navLoanProducts).toBeVisible();
  });

  test("TC06 – Grow Your Business nav link is visible", async ({ page }) => {
    await expect(homePage.navGrowYourBusiness).toBeVisible();
  });

  test("TC07 – Streamline Your Process nav link is visible", async ({ page }) => {
    await expect(homePage.navStreamlineProcess).toBeVisible();
  });

  test("TC08 – Trending Now nav link is visible", async ({ page }) => {
    await expect(homePage.navTrendingNow).toBeVisible();
  });

  test("TC09 – Join UWM button is visible", async ({ page }) => {
    await expect(homePage.joinUWMButton).toBeVisible();
  });

});
