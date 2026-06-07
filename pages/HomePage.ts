import { BasePage } from "./BasePage";

/**
 * UWM Public Homepage – https://www.uwm.com
 */
export class HomePage extends BasePage {

  // ─── Nav ──────────────────────────────────────────────────────────────────
  public readonly navLoanProducts      = this.locator("//a[@href='https://www.uwm.com/loan-products' and .//span[normalize-space()='Loan Products']]");
  public readonly navGrowYourBusiness  = this.locator("//a[@href='https://www.uwm.com/grow-your-business' and .//span[normalize-space()='Grow Your Business']]");
  public readonly navStreamlineProcess = this.locator("//span[normalize-space()='Streamline Your Process']");
  public readonly navTrendingNow       = this.locator("//span[normalize-space()='Trending Now']");

  // ─── Header CTAs ──────────────────────────────────────────────────────────
  public readonly logInButton          = this.locator("//a[@href='/login' and normalize-space()='Log In']");
  public readonly joinUWMButton        = this.locator("//a[@href='https://www.uwm.com/join-now' and normalize-space()='Join UWM']");

  // ─── Hero ─────────────────────────────────────────────────────────────────
  public readonly heroHeading          = this.locator("h1").first();

  // ─── Audience sections ────────────────────────────────────────────────────
  public readonly homebuyersSection    = this.locator("h4").filter({ hasText: /Homebuyers/i });
  public readonly realEstateSection    = this.locator("h4").filter({ hasText: /Real Estate Agents/i });
  public readonly careerSection        = this.locator("h4").filter({ hasText: /Career Seekers/i });
  public readonly brokersSection       = this.locator("h4").filter({ hasText: /Mortgage Brokers/i });

  // ─── Footer ───────────────────────────────────────────────────────────────
  public readonly footerPrivacyPolicy  = this.locator("(//a[@href='https://www.uwm.com/privacy-policy' and normalize-space()='Privacy Policy'])[1]");
  public readonly footerTermsOfUse     = this.locator("//a[@href='https://www.uwm.com/terms-of-use' and normalize-space()='Terms Of Use']");
  public readonly footerContactUs      = this.locator("//a[@href='https://www.uwm.com/contact' and normalize-space()='Contact Us']");
  public readonly footerNMLS           = this.locator('a[href*="nmlsconsumeraccess.org"]').first();
  public readonly footerDoNotSell      = this.locator('a[href*="ca-dont-share"]').first();
  public readonly facebookLink         = this.locator('a[href*="facebook.com"]').first();
  public readonly linkedInLink         = this.locator('a[href*="linkedin.com"]').first();

}
