import { test, expect } from "../../utilities/UITestUtils";

/**
 * EPIC 01 – UWM Public Website
 * User Story 04 – Footer Links & Legal Compliance
 */
test.describe("US04 – Footer & Legal Links @epic01 @regression", () => {
  test("TC01 – Privacy Policy link is present in footer", async ({ page }) => {
    const link = page.locator(
      "(//a[@href='https://www.uwm.com/privacy-policy' and normalize-space()='Privacy Policy'])[1]",
    );
    await expect(link).toBeVisible();
  });

  test("TC02 – Terms of Use link is present in footer", async ({ page }) => {
    const link = page.locator(
      "//a[@href='https://www.uwm.com/terms-of-use' and normalize-space()='Terms Of Use']",
    );
    await expect(link).toBeVisible();
  });

  test("TC03 – Contact Us link is present", async ({ page }) => {
    const link = page.locator(
      "//a[@href='https://www.uwm.com/contact' and normalize-space()='Contact Us']",
    );
    await expect(link).toBeVisible();
  });

  test("TC04 – NMLS link is present (regulatory requirement)", async ({
    page,
  }) => {
    const link = page.locator('a[href*="nmlsconsumeraccess.org"]').first();
    await expect(link).toBeVisible();
  });

  test("TC05 – Facebook social link is present", async ({ page }) => {
    const link = page.locator('a[href*="facebook.com"]').first();
    await expect(link).toBeVisible();
  });

  test("TC06 – LinkedIn social link is present", async ({ page }) => {
    const link = page.locator('a[href*="linkedin.com"]').first();
    await expect(link).toBeVisible();
  });

  test("TC07 – Do Not Sell link exists (CCPA compliance)", async ({ page }) => {
    const link = page.locator('a[href*="ca-dont-share"]').first();
    await expect(link).toBeVisible();
  });
});
