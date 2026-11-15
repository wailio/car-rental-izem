import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14/15 size
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  
  // Navigate to car 1
  const targetUrl = 'https://izem-motors.vercel.app/car/1';
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  // Click on "C'est moi" to go to screen 2
  console.log('Clicking "C\'est moi"...');
  await page.click('button:has-text("C\'est moi")');
  await page.waitForTimeout(1000);

  // Take screenshot of screen 2 header
  const screenshotPath = 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-screen2-header-matched.png';
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

main().catch(console.error);
