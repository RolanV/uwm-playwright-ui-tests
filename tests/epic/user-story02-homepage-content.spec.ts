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

  test("TC06 – Mortgage Matchup links in the Homebuyers card target mortgagematchup.com", async ({
    page,
  }) => {
    // The "Homebuyers" heading is unique on the page and its immediate parent is
    // the card that holds the section's links. That parent is a MUI Box whose
    // emotion class is build-generated, so the structural relationship is used
    // instead of the class name.
    const homebuyersCard = page
      .getByRole("heading", { name: "Homebuyers", exact: true })
      .locator("xpath=..");

    const matchupLinks = homebuyersCard.locator('a[href*="mortgagematchup.com"]');

    // Auto-retrying: the card must contain at least one such link. The scoped
    // count was not established during inspection, so it is not asserted here.
    await expect(matchupLinks).not.toHaveCount(0);

    // Verify every link in the card rather than an arbitrary .first().
    const total = await matchupLinks.count();
    for (let i = 0; i < total; i++) {
      const link = matchupLinks.nth(i);
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      expect(href, `matchup link ${i} must expose an href`).not.toBeNull();

      // Host comparison, not substring: a substring match would also accept
      // https://attacker.example/?next=mortgagematchup.com
      expect(
        new URL(href!, page.url()).hostname,
        `matchup link ${i} must point at the mortgagematchup.com host`,
      ).toMatch(/(^|\.)mortgagematchup\.com$/);
    }
  });

  test("TC07 – Find Your Fit link targets the uwmcareers.com host", async ({
    page,
  }) => {
    // Two anchors share this href, labelled "Find Your Fit" and "Careers", so the
    // intended one is identified by its visible text rather than by DOM order.
    // A role locator is not usable: getByRole("link", { name: /find your fit/i })
    // matches zero elements because the accessible name is not the visible text.
    const careerLink = page
      .locator('a[href*="uwmcareers.com"]')
      .filter({ hasText: /Find Your Fit/i });

    await expect(careerLink).toHaveCount(1);
    await expect(careerLink).toBeVisible();

    const href = await careerLink.getAttribute("href");
    expect(href, "careers link must expose an href").not.toBeNull();

    // Host comparison rather than repeating the locator's href substring.
    expect(
      new URL(href!, page.url()).hostname,
      "careers link must point at the uwmcareers.com host",
    ).toMatch(/(^|\.)uwmcareers\.com$/);
  });

  test("TC09 – Legal entity name is rendered as visible page text", async ({
    page,
  }) => {
    // This page exposes no <footer> element and no contentinfo landmark, so the
    // assertion cannot be scoped to a branding or legal region. useInnerText
    // restricts the match to rendered text, so CSS-hidden copy no longer
    // satisfies it. This remains a broad, page-wide assertion.
    await expect(page.locator("body")).toContainText(
      /United Wholesale Mortgage/i,
      { useInnerText: true },
    );
  });

  test("TC10 – UWM logo image loads successfully", async ({ page }) => {
    // Exactly one image matches this accessible name, derived from the alt text
    // "Back to UWM company homepage."
    const logo = page.getByRole("img", { name: /uwm/i });

    await expect(logo).toHaveCount(1);
    await expect(logo).toBeVisible();

    // toBeVisible() passes for a broken image, which still occupies layout.
    // naturalWidth is only non-zero once the bitmap has decoded. expect.poll
    // retries, so a late-decoding image does not fail spuriously.
    await expect
      .poll(
        async () =>
          logo.evaluate((img: HTMLImageElement) =>
            img.complete ? img.naturalWidth : 0,
          ),
        { message: "UWM logo should decode to a non-zero intrinsic width" },
      )
      .toBeGreaterThan(0);
  });
});
