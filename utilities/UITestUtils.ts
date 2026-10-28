import { test as base_test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";
import * as dotenv from "dotenv";

dotenv.config();

/** UI fixture – navigates to process.env.URL and waits for network idle */
export const test = base_test.extend({
  page: async ({ page }, use: Function) => {
    const url = process.env.URL || "https://www.uwm.com";
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

    BasePage.setPage(page);
    await use(page);
  },
});

export { expect };
