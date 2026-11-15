import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 }
  });

  const url = 'https://izem-motors.vercel.app';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const section = page.locator('#prestations');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const screenshotPath = 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-prod-services-verified.png';
  await section.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

main().catch(console.error);
