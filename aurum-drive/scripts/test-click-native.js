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

  // Click day 2
  await page.click('.day-cell[data-day="2"]');
  await page.waitForTimeout(300);

  // Click day 5
  await page.click('.day-cell[data-day="5"]');
  await page.waitForTimeout(400);

  // Scroll modal down
  await page.evaluate(() => {
    const modalScroll = document.querySelector('.ios-modal-scroll');
    if (modalScroll) modalScroll.scrollTop = 280;
  });
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'scripts/verify_modal_calendar_playwright_click.png', fullPage: false });
  console.log('Interaction succeeded!');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
