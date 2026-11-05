const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Open modal
  await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('div')).find(el => {
      const s = el.getAttribute('style') || '';
      return (s.includes('cursor: pointer') || s.includes('cursor:pointer')) && el.querySelector('img');
    });
    if (card) card.click();
  });
  await page.waitForTimeout(600);

  // Navigate to next month (November 2026)
  await page.click('button[aria-label="Mois suivant"]');
  await page.waitForTimeout(400);

  // Click day 2 and day 5
  await page.click('.day-cell[data-day="2"]');
  await page.waitForTimeout(300);
  await page.click('.day-cell[data-day="5"]');
  await page.waitForTimeout(400);

  // Click on "Réserver ce véhicule"
  await page.click('.vm-btn-reserve');
  await page.waitForTimeout(1000);

  // Capture where the page landed
  await page.screenshot({ path: 'scripts/verify_landing_scroll_position.png', fullPage: false });
  console.log('Current page URL:', page.url());
  console.log('Scroll position Y:', await page.evaluate(() => window.scrollY));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
