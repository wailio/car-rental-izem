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

async function run() {
  const browser = await chromium.launch({ headless: true });
  const token = getAdminToken();

  // Desktop accordion open test
  const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await deskCtx.addCookies([{ name: 'admin_session', value: token, domain: 'localhost', path: '/' }]);
  const pageD = await deskCtx.newPage();
  await pageD.goto('http://localhost:3000/admin/website-info', { waitUntil: 'networkidle' });
  const avisBtn = pageD.locator('button.ios-page-nav-btn:has-text("Avis Clients")');
  await avisBtn.click();
  await pageD.waitForTimeout(600);
  const shapeD = pageD.locator('text=/136 Avis Clients Google/').first();
  await shapeD.click();
  await pageD.waitForTimeout(600);

  // Click on the first review card to open accordion
  const firstReviewHeader = pageD.locator('text=Avis #1').first();
  await firstReviewHeader.click();
  await pageD.waitForTimeout(500);
  await pageD.screenshot({ path: 'scripts/admin_reviews_drawer_expanded.png' });
  console.log('Expanded accordion screenshot taken!');

  // Mobile test
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await mobileCtx.addCookies([{ name: 'admin_session', value: token, domain: 'localhost', path: '/' }]);
  const pageM = await mobileCtx.newPage();
  await pageM.goto('http://localhost:3000/admin/website-info', { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(800);
  
  // On mobile click topic selector or scroll to Avis
  await pageM.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pageM.waitForTimeout(400);
  const shapeM = pageM.locator('text=/136 Avis Clients Google/').first();
  if (await shapeM.isVisible()) {
    await shapeM.click();
    await pageM.waitForTimeout(600);
    await pageM.screenshot({ path: 'scripts/admin_reviews_drawer_mobile.png' });
    console.log('Mobile screenshot taken!');
  }

  await browser.close();
  console.log('Extra tests completed successfully!');
}

run().catch(console.error);
