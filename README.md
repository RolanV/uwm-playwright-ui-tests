# UWM Website — Playwright UI Automation

[![Playwright Tests](https://github.com/RolanV/uwm-playwright-ui-tests/actions/workflows/playwright.yml/badge.svg?branch=main&event=push)](https://github.com/RolanV/uwm-playwright-ui-tests/actions/workflows/playwright.yml)

## Overview

A Playwright + TypeScript UI automation suite for the public marketing website at [uwm.com](https://www.uwm.com). **24 tests** across three spec files cover homepage navigation, audience content, outbound link destinations, branding and footer/legal links. Tests run in **Google Chrome** and execute in **GitHub Actions** on pushes to `main` and pull requests targeting `main`.

The suite is built around one principle: an assertion is only worth having if it can fail when the application is wrong. Several checks were deliberately deepened from presence to behaviour — and one was validated with a negative-control experiment to prove it actually detects the defect it claims to catch.

This is an independent educational portfolio project, not affiliated with United Wholesale Mortgage. The target is a live third-party production site, so a failure may reflect a content change rather than a framework defect.

---

## Tech Stack

| Component | Version | Role |
|---|---|---|
| `@playwright/test` | `1.56.0` | Test runner, browser automation, `expect` assertions (including `expect.poll`) |
| `@types/node` | `24.7.0` | Node type definitions |
| `dotenv` | `17.2.3` | Loads `.env` in the config and the UI fixture |
| TypeScript | — | Specs, page objects and config are `.ts`; Playwright transpiles them at run time |
| Node.js | 24 | The version used in CI |

`@playwright/test`, `@types/node` and `dotenv` are npm `devDependencies` declared in `package.json`; there are no runtime `dependencies`. Node.js is a prerequisite rather than a package, and **Google Chrome is a browser prerequisite, not an npm dependency** — `playwright.config.ts` sets `channel: 'chrome'`, so the suite drives the installed Chrome rather than bundled Chromium. Two further declared devDependencies are not imported by the committed source and are tracked for removal.

**On TypeScript:** the project is written in TypeScript and `tsconfig.json` sets `strict: true`, but `typescript` is not a project dependency and there is **no `tsc` type-checking gate** in any script or CI step. Playwright transpiles the files to run them; it does not type-check them. Adding a type-check step is a planned improvement.

---

## Test Coverage

| Spec | User story | Tests | Tag | Scope |
|---|---|---:|---|---|
| `user-story01-homepage-navigation.spec.ts` | US01 — Homepage Navigation | 9 | `@smoke` | Title, canonical URL, hero `<h1>`, four primary nav links, Join UWM CTA |
| `user-story02-homepage-content.spec.ts` | US02 — Homepage Content | 8 | `@regression` | Four audience sections, Mortgage Matchup and careers link destinations, branding text, logo load |
| `user-story03-footer-and-legal.spec.ts` | US04 — Footer & Legal Links | 7 | `@regression` | Privacy Policy, Terms of Use, Contact Us, NMLS Consumer Access, Facebook, LinkedIn, CCPA "Do Not Sell" |

**9 smoke + 15 regression = 24 tests.** The tags are mutually exclusive; every test also carries `@epic01`.

Scope is the public homepage and the links it exposes. There are no authenticated flows, no form submissions, no API or performance tests, and no browser other than Chrome.

---

## Project Structure

```text
pages/
  BasePage.ts        Holds the Page reference; exposes locator() / frameLocator()
  HomePage.ts        UWM homepage locators
tests/epic/
  user-story01-homepage-navigation.spec.ts    9 tests  @smoke
  user-story02-homepage-content.spec.ts       8 tests  @regression
  user-story03-footer-and-legal.spec.ts       7 tests  @regression
utilities/
  UITestUtils.ts     UI fixture — overrides Playwright's `page` fixture
  APITestUtils.ts    API fixture — present but not used by any spec
.github/workflows/
  playwright.yml     CI — smoke job gates the regression job
playwright.config.ts
```

**The UI fixture is the architectural centre of the suite.** `UITestUtils.ts` extends Playwright's `test` and overrides the built-in `page` fixture, so every test receives a page already navigated to `process.env.URL || "https://www.uwm.com"` and registered with `BasePage`:

```text
test() requested
    ▼
UITestUtils `page` fixture  →  page.goto(URL)  →  BasePage.setPage(page)
    ▼
beforeEach  →  new HomePage(page)      (US01, US02)
    ▼
test body — assertions only; no navigation
```

That removes navigation boilerplate from every spec, which is why no test calls `page.goto()`. It also means navigation happens inside the per-test budget — see [Known Limitations](#known-limitations).

### Runner configuration

| Setting | Value |
|---|---|
| `fullyParallel` / `workers` | `true` / `4` |
| `retries` | `1` (local and CI) |
| `reporter` | `html` |
| `baseURL` | `process.env.URL`, defaulting to `https://www.uwm.com` |
| `trace` / `screenshot` / `video` | `retain-on-failure` / `only-on-failure` / `retain-on-failure` |
| `navigationTimeout` / `actionTimeout` | `60_000` / `15_000` |
| Project | `Google Chrome` — `channel: 'chrome'`, viewport `1800×1000` |

Edge, Chromium, Firefox, WebKit and two mobile profiles are present in the config but commented out.

---

## Quick Start

```bash
git clone https://github.com/RolanV/uwm-playwright-ui-tests.git
cd uwm-playwright-ui-tests
npm ci
npx playwright install chrome
```

`npx playwright install chrome` is a required separate step: `npm ci` installs the Playwright library, not browser binaries. Because `channel: 'chrome'` is configured, plain `npx playwright install` — which fetches bundled Chromium — is not sufficient. On Linux add `--with-deps` for system libraries.

No `.env` file is needed; the config falls back to `https://www.uwm.com`. To target another environment, set `URL` or copy `.env.example` to `.env`. Only `URL` has any effect on the committed tests.

---

## Running Tests

```bash
npx playwright test --grep @smoke        #  9 tests
npx playwright test --grep @regression   # 15 tests
npx playwright test                      # 24 tests
npx playwright test --headed             # visible browser
npx playwright test --ui                 # interactive UI mode
npx playwright show-report               # open the last HTML report
```

`package.json` provides `test:all`, `test:all:headed`, `test-smoke` and `report`. There is no regression script, so use `--grep @regression` directly.

The HTML report is written to `playwright-report/` on every run. For failed tests it embeds the trace, a screenshot and a video; open a trace directly with `npx playwright show-trace test-results/<dir>/trace.zip`.

---

## GitHub Actions CI/CD

One workflow, [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). It runs on pushes to `main`, pull requests targeting `main`, and manual dispatch. There are no scheduled runs.

**Smoke gates regression.** The regression job declares `needs: smoke`, so a broken smoke test fails fast and regression never starts:

```text
push / PR to main  ──►  Smoke (9 @smoke)  ──fails──►  Regression skipped
                              │ passes
                              ▼
                        Regression (15 @regression)
```

| | Detail |
|---|---|
| Runner | `ubuntu-24.04`, pinned — Playwright `1.56.0` has no ffmpeg build for Ubuntu 26.04, which `ubuntu-latest` now resolves to |
| Node | `node-version: 24`, npm cache enabled |
| Setup | `npm ci`, then `npx playwright install chrome ffmpeg --with-deps` |
| Run | `npx playwright test --grep @smoke` / `--grep @regression`, reporter `list,html` |
| Config | `URL` and `CI` passed as environment variables — no repository secret required |
| Artifacts | Both jobs upload their HTML report (14-day retention); failure traces upload on failure only |

---

## Engineering Highlights

Four US02 assertions were rewritten so they test behaviour rather than presence. Each was based on inspecting the live DOM, not on guessed selectors.

**Scoped link validation (TC06).** The homepage carries three `mortgagematchup.com` links, so a page-wide check proves nothing about the Homebuyers card. The `Homebuyers` heading is unique, so the card is reached structurally through its direct parent — the parent is a MUI `Box` whose emotion class hash is build-generated and unusable as a selector. Every matched link is then verified, rather than an arbitrary `.first()`:

```ts
const homebuyersCard = page
  .getByRole("heading", { name: "Homebuyers", exact: true })
  .locator("xpath=..");

const matchupLinks = homebuyersCard.locator('a[href*="mortgagematchup.com"]');
```

Each link's destination is compared as a parsed host, `new URL(href, page.url()).hostname` against `/(^|\.)mortgagematchup\.com$/`, not as a substring — a substring check would also accept `https://attacker.example/?next=mortgagematchup.com`.

**Host validation over DOM order (TC07).** Two anchors share the careers href, labelled "Find Your Fit" and "Careers". A role locator is not usable: `getByRole("link", { name: /find your fit/i })` matches zero elements, because the accessible name differs from the visible text. The test filters on visible text, pins the count to exactly 1, and validates the `uwmcareers.com` host the same way.

**Rendered-text branding check (TC09).** Adding `{ useInnerText: true }` restricts the match to rendered text, so CSS-hidden copy no longer satisfies it. The page exposes no `<footer>` element and no `contentinfo` landmark, so the assertion stays page-wide by necessity — recorded as a comment in the spec rather than papered over.

**Image-load validation (TC10).** `toBeVisible()` passes for a broken image, which still occupies layout. `naturalWidth` is non-zero only after the bitmap decodes, and `expect.poll` retries so a slow decode does not fail spuriously:

```ts
await expect
  .poll(
    async () =>
      logo.evaluate((img: HTMLImageElement) =>
        img.complete ? img.naturalWidth : 0,
      ),
    { message: "UWM logo should decode to a non-zero intrinsic width" },
  )
  .toBeGreaterThan(0);
```

### Negative control for TC10

A new assertion that has never been seen to fail is of unknown value, so TC10 was validated directly.

A **standalone, in-memory Playwright experiment** — not a run of the committed suite — opened the homepage with a route handler that aborted the request for the logo asset. Observed under that single abort:

- `naturalWidth` was `0`, with `complete` reporting `true`.
- The original `toBeVisible()` assertion **passed** despite the broken image, confirming it was blind to this defect.
- The `expect.poll` assertion **failed**, as intended.

This established that the new check detects a logo that fails to load. The experiment is deliberately **not committed as a permanent test**: the route-abort code lives outside the repository, and CI does not reproduce it.

---

## Verified Results

Latest `main` run — [**41250840028**](https://github.com/RolanV/uwm-playwright-ui-tests/actions/runs/41250840028) on commit `3b9b234`, conclusion **success**, on `ubuntu-24.04` with Node 24:

| Job | Tests | Passed first attempt | Passed on retry | Failed |
|---|---:|---:|---:|---:|
| Smoke | 9 | 8 | 1 | 0 |
| Regression | 15 | 15 | 0 | 0 |

All 24 tests executed, across two separate jobs rather than one combined run. Both HTML reports uploaded, and all four strengthened US02 assertions passed on their first attempt.

**The run succeeded but was not flake-free.** One unmodified smoke test, `US01 TC07`, timed out during the fixture's `networkidle` navigation and passed on retry. `retries: 1` is what kept the job green. The same failure mode has appeared in another spec on a different run, so it is a fixture-level issue rather than a property of one test, and it is **not yet fixed** — see below.

---

<a name="known-limitations"></a>

## Known Limitations

**Live third-party target.** Tests run against the real production site. Content, markup and generated class names can change without notice, and no staging environment or recorded fixture is used.

**Navigation flakiness — open.** The UI fixture navigates with `waitUntil: "networkidle"`, which Playwright's documentation discourages for pages that keep connections open. The fixture requests a 60-second navigation timeout, but no per-test timeout is configured, so Playwright's 30-second default applies first and the longer value is never reached. `retries: 1` masks this in job results. Fixing it properly — not with sleeps or weakened assertions — is the next planned change.

**Page Object Model is not applied consistently.** US01 uses `HomePage` genuinely; US02 constructs it without reading it, and US04 does not import it. Consolidating locators into the page objects is tracked work.

**Some checks remain presence-oriented.** Most tests outside the four strengthened US02 cases assert visibility only, which passes for a link pointing at the wrong destination. TC10 is currently the only test whose failure mode has been empirically confirmed.

**Coverage boundaries.** No authenticated mortgage workflows, no form submission, no API regression tests, no visual or performance testing, and Chrome only on a single desktop viewport.

Smaller items — unused locators and dependencies, stale package metadata (the manifest is still named `template-automation`), and a type-check gate — are tracked for follow-up and intentionally left out of this section.

---

## Independence Disclaimer

This is an independent educational portfolio project. It is **not affiliated with, endorsed by, or sponsored by United Wholesale Mortgage (UWM), UWM Holdings Corporation, or any of their subsidiaries.** The UWM name, logo and website content belong to their respective owners and are referenced solely as the publicly accessible subject of UI automation practice.

Like any browser automation, the tests read page content and DOM attributes in order to assert on them. The committed tests do not authenticate, do not submit forms, and do not intentionally create or modify application data; they issue ordinary read-only page loads to a public marketing website, and run only on push, pull request or manual dispatch — never on a schedule.
