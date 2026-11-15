import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 950 }
  });

  await page.goto('http://localhost:3005', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Screenshot with Location Dropdown Open
  console.log('Opening location dropdown...');
  await page.click('text="Lieu de retrait"');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-full-location-dropdown.png',
    clip: { x: 100, y: 220, width: 1240, height: 550 }
  });
  console.log('Saved screenshot-full-location-dropdown.png');

  // 2. Screenshot with Calendar Open
  console.log('Opening calendar popover...');
  await page.click('text="Date de retrait"');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-full-calendar-popover.png',
    clip: { x: 100, y: 140, width: 1240, height: 650 }
  });
  console.log('Saved screenshot-full-calendar-popover.png');

  await browser.close();
}

main().catch(console.error);
