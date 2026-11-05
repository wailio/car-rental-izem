import { chromium, devices } from 'playwright';

async function testMobileModal() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 14 Pro'] });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/avis', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on "Ouvrir en fenêtre"
  await page.click('text=Ouvrir en fenêtre');
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'scripts/mobile_reviews_modal.png' });
  await browser.close();
  console.log('Mobile modal screenshot saved successfully!');
}

testMobileModal().catch(err => {
  console.error(err);
  process.exit(1);
});
