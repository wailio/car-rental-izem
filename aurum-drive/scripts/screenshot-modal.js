const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to fleet section
  await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const fleet = sections.find(s => s.textContent && s.textContent.includes('Vehicules') || s.textContent && s.textContent.includes('flotte'));
    if (fleet) fleet.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(800);

  // Find any clickable card and click it
  await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const card = allDivs.find(el => {
      const s = el.getAttribute('style') || '';
      return (s.includes('cursor: pointer') || s.includes('cursor:pointer')) && el.querySelector('img');
    });
    if (card) card.click();
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/verify_modal_calendar.png', fullPage: false });
  console.log('OK - scripts/verify_modal_calendar.png');
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
