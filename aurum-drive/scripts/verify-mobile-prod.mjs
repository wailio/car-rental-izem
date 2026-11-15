import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  // 390px Mobile
  const page390 = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  await page390.goto('https://izem-motors.vercel.app', { waitUntil: 'domcontentloaded' });
  await page390.waitForTimeout(1000);
  const section390 = page390.locator('#prestations');
  await section390.scrollIntoViewIfNeeded();
  await page390.waitForTimeout(500);
  await section390.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-prod-services-mobile-390.png'
  });
  console.log('Saved mobile 390 screenshot');
  await page390.close();

  // 320px Small Mobile
  const page320 = await browser.newPage({
    viewport: { width: 320, height: 600 },
    isMobile: true
  });
  await page320.goto('https://izem-motors.vercel.app', { waitUntil: 'domcontentloaded' });
  await page320.waitForTimeout(1000);
  const section320 = page320.locator('#prestations');
  await section320.scrollIntoViewIfNeeded();
  await page320.waitForTimeout(500);
  await section320.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-prod-services-mobile-320.png'
  });
  console.log('Saved mobile 320 screenshot');
  await page320.close();

  await browser.close();
}

main().catch(console.error);
