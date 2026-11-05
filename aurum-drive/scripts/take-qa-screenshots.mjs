import { chromium } from 'playwright';
import path from 'path';
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

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const token = getAdminToken();
  await context.addCookies([
    {
      name: 'admin_session',
      value: token,
      domain: '127.0.0.1',
      path: '/',
    },
    {
      name: 'admin_session',
      value: token,
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();

  // 1. Public /avis screenshot
  console.log('Capturing public /avis...');
  await page.goto('http://127.0.0.1:3000/avis', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(process.cwd(), 'scripts', 'public_avis_page.png'),
    fullPage: false,
  });
  console.log('Saved scripts/public_avis_page.png');

  // 2. Admin website-info /avis section
  console.log('Capturing admin website-info avis...');
  await page.goto('http://127.0.0.1:3000/admin/website-info', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on "Avis Clients" button in the left sidebar of website-info
  const avisTabBtn = page.locator('button:has-text("Avis Clients"), button:has-text("Avis")').first();
  if (await avisTabBtn.isVisible()) {
    await avisTabBtn.click();
    await page.waitForTimeout(1500);
  }

  await page.screenshot({
    path: path.join(process.cwd(), 'scripts', 'admin_avis_management.png'),
    fullPage: false,
  });
  console.log('Saved scripts/admin_avis_management.png');

  await browser.close();
}

capture().catch(console.error);
