const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // 1. Mobile viewport (390 x 844)
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto('https://aurum-drive.vercel.app', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1000);
  
  // Mobile Hero screenshot
  await mobile.screenshot({ path: 'scripts/verify_mobile_hero_new.png' });

  // Open mobile drawer
  const burger = await mobile.locator('button[aria-label="Ouvrir le menu"]');
  if (await burger.count() > 0) {
    await burger.click();
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: 'scripts/verify_mobile_drawer_right.png' });
    // Close drawer
    const closeBtn = await mobile.locator('button[aria-label="Fermer le menu"]');
    if (await closeBtn.count() > 0) await closeBtn.click();
    await mobile.waitForTimeout(300);
  }

  // Scroll down to Services & Fleet
  await mobile.evaluate(() => window.scrollBy(0, 750));
  await mobile.waitForTimeout(600);
  await mobile.screenshot({ path: 'scripts/verify_mobile_services_fleet.png' });

  // Click first vehicle card to check modal
  const fleetCard = await mobile.locator('text=Dès').first();
  if (await fleetCard.count() > 0) {
    await fleetCard.click();
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: 'scripts/verify_mobile_modal_comfy.png' });
    const modalClose = await mobile.locator('button[aria-label="Fermer la fenêtre"]');
    if (await modalClose.count() > 0) await modalClose.click();
    await mobile.waitForTimeout(300);
  }

  // Scroll down to WhyChooseUs & HowItWorks
  await mobile.evaluate(() => window.scrollBy(0, 1100));
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: 'scripts/verify_mobile_guarantee_howitworks.png' });

  // 2. Desktop viewport (1440 x 900) — verify PC is untouched!
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto('https://aurum-drive.vercel.app', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(1000);
  await desktop.screenshot({ path: 'scripts/verify_pc_untouched_hero.png' });

  await desktop.evaluate(() => window.scrollBy(0, 1100));
  await desktop.waitForTimeout(600);
  await desktop.screenshot({ path: 'scripts/verify_pc_untouched_sections.png' });

  console.log('ALL_VERIFICATION_SCREENSHOTS_DONE');
  await browser.close();
})();
