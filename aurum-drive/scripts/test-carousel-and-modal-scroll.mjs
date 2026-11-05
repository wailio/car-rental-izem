import { chromium } from 'playwright';

async function testCarouselAndScroll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to reviews section
  const heading = page.locator('text=Avis de nos Clients').first();
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 1. Open modal via static button
  const openModalBtn = page.locator('text=Voir tous les avis en fenêtre').first();
  await openModalBtn.click();
  await page.waitForTimeout(700);

  // Record page scroll position
  const initialPageScrollY = await page.evaluate(() => window.scrollY);

  // Target the modal scroll body
  const modalScrollBody = page.locator('[role="dialog"] .overflow-y-auto');
  const initialModalScrollTop = await modalScrollBody.evaluate((el) => el.scrollTop);

  // Hover inside modal reviews list and scroll mouse wheel down
  await modalScrollBody.hover();
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);

  const afterModalScrollTop = await modalScrollBody.evaluate((el) => el.scrollTop);
  const afterPageScrollY = await page.evaluate(() => window.scrollY);

  console.log(`Scroll Test Results:`);
  console.log(`- Modal initial scrollTop: ${initialModalScrollTop}px`);
  console.log(`- Modal after wheel scrollTop: ${afterModalScrollTop}px (Scrolled by: ${afterModalScrollTop - initialModalScrollTop}px)`);
  console.log(`- Background website scrollY change: ${afterPageScrollY - initialPageScrollY}px (Should be exactly 0px!)`);

  await page.screenshot({ path: 'scripts/modal_wheel_scroll_verified.png' });

  if (afterPageScrollY !== initialPageScrollY) {
    console.error('FAIL: Background website scrolled while scrolling modal!');
    process.exit(1);
  }

  if (afterModalScrollTop <= initialModalScrollTop) {
    console.error('FAIL: Modal did not scroll when mouse wheel was scrolled!');
    process.exit(1);
  }

  console.log('SUCCESS: Modal scrolled smoothly with mouse wheel and background website stayed 100% frozen!');
  await browser.close();
}

testCarouselAndScroll().catch((err) => {
  console.error(err);
  process.exit(1);
});
