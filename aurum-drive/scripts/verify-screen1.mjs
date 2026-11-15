import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  await page.goto('https://izem-motors.vercel.app/car/1', { waitUntil: 'networkidle' });
  const screenshotPath = 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-screen1-verified.png';
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screen 1 to ${screenshotPath}`);
  await browser.close();
}

main().catch(console.error);
