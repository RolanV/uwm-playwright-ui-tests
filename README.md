# UWM Automation Framework

Playwright + TypeScript test automation for **[UWM.com](https://www.uwm.com)** (United Wholesale Mortgage).

---

## Project Structure

```
├── .github/
│   ├── prompts/                  # Copilot prompt helpers for writing locators and tests
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
│
├── pages/
│   ├── BasePage.ts               # Shared base class for all page objects
│   └── HomePage.ts               # UWM public homepage locators and actions
│
├── tests/
│   └── epic/
│       ├── user-story01-homepage-navigation.spec.ts   # 9 tests  @smoke
│       ├── user-story02-homepage-content.spec.ts      # 8 tests  @regression
│       └── user-story03-footer-and-legal.spec.ts      # 7 tests  @regression
│
├── utilities/
│   ├── UITestUtils.ts            # UI test fixture (auto-navigates to URL)
│   └── APITestUtils.ts           # API test fixture (authenticated context)
│
├── .env                          # Local environment variables (not committed)
├── .env.example                  # Environment variable template
└── playwright.config.ts
```

---

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env
```

Set `URL` in your `.env`:

```ini
URL=https://www.uwm.com
```

---

## Running Tests

### Headless (default)

```bash
# All tests
npx playwright test

# Smoke only
npx playwright test --grep @smoke

# Regression only
npx playwright test --grep @regression
```

### Headed (visible browser)

```bash
# All tests
npx playwright test --headed

# Smoke only
npx playwright test --headed --grep @smoke

# Regression only
npx playwright test --headed --grep @regression
```

### Interactive UI mode

```bash
npx playwright test --ui
```

### View the HTML report

```bash
npx playwright show-report
```

---

## Test Suite

| File | User Story | Tests | Tag |
|---|---|---|---|
| `user-story01-homepage-navigation.spec.ts` | Page title, URL, H1, nav links, header CTAs | 9 | `@smoke` |
| `user-story02-homepage-content.spec.ts` | Audience sections, branding, logo, external links | 8 | `@regression` |
| `user-story03-footer-and-legal.spec.ts` | Footer links, social links, NMLS, CCPA compliance | 7 | `@regression` |

**Total: 24 tests**

---

## GitHub Actions

The pipeline lives at `.github/workflows/playwright.yml`.

### When it runs

Triggers automatically on every **push** or **pull request** to `main`, `master`, or `developer`.
Can also be triggered manually from the **Actions** tab in GitHub.

### How it works

Two jobs run in sequence — smoke always runs first, regression only starts if smoke passes:

```
push / PR
    │
    ▼
┌─────────┐
│  smoke  │── fails ──► regression SKIPPED
└─────────┘
    │ passes
    ▼
┌─────────────┐
│  regression │
└─────────────┘
```

This means if a `@smoke` test breaks, you get a fast failure and regression never wastes time running.

### Artifacts

Every run uploads artifacts you can download from the **Actions** tab → select a run → **Artifacts** section:

| Artifact | When uploaded | Kept for |
|---|---|---|
| `smoke-report` | Always | 14 days |
| `regression-report` | Always | 14 days |
| `smoke-results` | Smoke failure only | 7 days |
| `regression-results` | Regression failure only | 7 days |

The reports contain the full Playwright HTML report with traces, screenshots, and videos for failed tests.

### Required GitHub Secret

Add this once in **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `URL` | `https://www.uwm.com` |

