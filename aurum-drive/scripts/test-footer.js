const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to footer
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
  });
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'scripts/verify_footer_redesign.png', fullPage: false });
  console.log('Footer screenshot saved');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
