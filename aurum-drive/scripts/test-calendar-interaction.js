const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to fleet
  await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const fleet = sections.find(s => s.textContent && (s.textContent.includes('Véhicules') || s.textContent.includes('flotte')));
    if (fleet) fleet.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(600);

  // Click card
  await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const card = allDivs.find(el => {
      const s = el.getAttribute('style') || '';
      return (s.includes('cursor: pointer') || s.includes('cursor:pointer')) && el.querySelector('img');
    });
    if (card) card.click();
  });
  await page.waitForTimeout(600);

  // Click next month '>'
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Mois suivant"]');
    if (nextBtn) nextBtn.click();
  });
  await page.waitForTimeout(500);

  // Click day 2 then day 6 (both are before the Nov 7-11 reserved block)
  await page.evaluate(() => {
    const dayCircles = Array.from(document.querySelectorAll('.day-circle'));
    const day2 = dayCircles.find(el => el.textContent?.trim() === '2');
    if (day2) day2.click();
  });
  await page.waitForTimeout(300);

  await page.evaluate(() => {
    const dayCircles = Array.from(document.querySelectorAll('.day-circle'));
    const day6 = dayCircles.find(el => el.textContent?.trim() === '6');
    if (day6) day6.click();
  });
  await page.waitForTimeout(500);

  // Scroll modal down to capture action buttons and calendar selection
  await page.evaluate(() => {
    const modalScroll = document.querySelector('.ios-modal-scroll');
    if (modalScroll) modalScroll.scrollTop = 280;
  });
  await page.waitForTimeout(400);

  await page.screenshot({ path: 'scripts/verify_modal_calendar_interaction.png', fullPage: false });
  console.log('OK - scripts/verify_modal_calendar_interaction.png');
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
