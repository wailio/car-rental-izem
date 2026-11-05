const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // 1. Desktop test
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Dispatch mouseenter on the aside element to reveal the tooltip
  await page.evaluate(() => {
    const el = document.querySelector('aside[aria-label="Assistance WhatsApp"]');
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      const tooltip = el.querySelector('div');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(0)';
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scripts/verify_whatsapp_desktop.png', fullPage: false });

  const href = await page.getAttribute('aside[aria-label="Assistance WhatsApp"] a', 'href');
  console.log('Desktop WhatsApp link:', href);

  // 2. Mobile test (iPhone 13 viewport)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'scripts/verify_whatsapp_mobile.png', fullPage: false });

  const mobileHref = await mobilePage.getAttribute('aside[aria-label="Assistance WhatsApp"] a', 'href');
  console.log('Mobile WhatsApp link:', mobileHref);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
