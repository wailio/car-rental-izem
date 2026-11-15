import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 950 }
  });

  console.log('Navigating to live production https://izem-motors.vercel.app...');
  await page.goto('https://izem-motors.vercel.app', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Screenshot with Calendar Open
  await page.click('text="Date de retrait"');
  await page.waitForTimeout(500);
  const screenshotPath = 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-live-production-verified.png';
  await page.screenshot({
    path: screenshotPath,
    clip: { x: 100, y: 140, width: 1240, height: 650 }
  });
  console.log(`Saved ${screenshotPath}`);

  await browser.close();
}

main().catch(console.error);
