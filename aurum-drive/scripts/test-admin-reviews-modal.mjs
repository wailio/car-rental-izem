import { chromium } from 'playwright';
import crypto from 'crypto';

const SESSION_SECRET = 'chateau_art_secret_hmac_token_key_2026';

function getAdminToken() {
  const payload = {
    u: 'wailio',
    r: 'developer',
    perms: ['dashboard', 'products', 'orders', 'sales', 'website-info', 'users'],
    iat: Date.now(),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64');
  return `${payloadStr}.${hmac}`;
}

async function testAdminReviewsModal() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const token = getAdminToken();
  await context.addCookies([
    { name: 'admin_session', value: token, domain: 'localhost', path: '/' },
    { name: 'admin_session', value: token, domain: '127.0.0.1', path: '/' },
  ]);

  const page = await context.newPage();

  console.log('Navigating to admin website-info...');
  await page.goto('http://localhost:3000/admin/website-info', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on "Avis Clients" in the CMS sidebar
  console.log('Clicking Avis Clients in sidebar...');
  const avisPageBtn = page.locator('button.ios-page-nav-btn:has-text("Avis Clients")');
  await avisPageBtn.click();
  await page.waitForTimeout(800);

  // Click on the sub-section "En-tête & Avis Clients" if needed
  const subSectionBtn = page.locator('button.ios-sub-nav-btn:has-text("En-tête & Avis Clients")');
  if (await subSectionBtn.isVisible()) {
    await subSectionBtn.click();
    await page.waitForTimeout(600);
  }

  // Scroll to bottom where the shape is
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  // Take screenshot of the new page layout showing the cool small shape
  await page.screenshot({ path: 'scripts/admin_reviews_shape_view.png' });
  console.log('Captured scripts/admin_reviews_shape_view.png');

  // Verify that the small shape exists and click it
  const coolShape = page.locator('text=/136 Avis Clients Google/').first();
  await coolShape.click();
  await page.waitForTimeout(700);

  // Take screenshot of the modal window (ignoring background with backdrop blur)
  await page.screenshot({ path: 'scripts/admin_reviews_modal_page1.png' });
  console.log('Captured scripts/admin_reviews_modal_page1.png');

  // Measure the vertical position (bounding box) of the pagination buttons on Page 1
  const nextBtn = page.locator('button:has-text("Suivant →")');
  const boxPage1 = await nextBtn.boundingBox();
  console.log('Page 1 Next button bounding box:', boxPage1);

  // Click "Suivant →" to go to Page 2
  await nextBtn.click();
  await page.waitForTimeout(700);

  // Measure the vertical position on Page 2
  const boxPage2 = await nextBtn.boundingBox();
  console.log('Page 2 Next button bounding box:', boxPage2);

  const yDifference = Math.abs((boxPage2?.y || 0) - (boxPage1?.y || 0));
  console.log(`Vertical position shift: ${yDifference}px (must be 0px for 100% static stability!)`);

  await page.screenshot({ path: 'scripts/admin_reviews_modal_page2.png' });
  console.log('Captured scripts/admin_reviews_modal_page2.png');

  if (yDifference > 2) {
    console.error(`FAIL: Pagination button location jumped by ${yDifference}px!`);
    process.exit(1);
  }

  console.log('SUCCESS: Pagination location is 100% static and smooth without jumping!');
  await browser.close();
}

testAdminReviewsModal().catch((err) => {
  console.error(err);
  process.exit(1);
});
