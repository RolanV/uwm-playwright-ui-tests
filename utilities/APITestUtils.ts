import { test as base_test, expect, APIRequestContext, request } from "@playwright/test";

type APIFixtures = { apiContext: APIRequestContext };

/** API fixture – sets up an authenticated Playwright API context */
export const test = base_test.extend<APIFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },
});

export { expect };
