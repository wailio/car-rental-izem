import { chromium } from 'playwright';

const ARTIFACT_DIR = 'C:/Users/hp/.gemini/antigravity/brain/bef978b0-8154-436b-84aa-f54df1071275';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Categories section with new pro shadows and contours
  const catSection = await page.locator('section:has-text("Choisissez votre catégorie")').first();
  await catSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_categories_pro_shadows.png` });
  console.log('✅ Categories pro shadows captured');

  // 2. Featured fleet section with new darker/grey cards matching user reference
  const fleetSection = await page.locator('section:has-text("Véhicules disponibles à")').first();
  await fleetSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fleet_grey_cards.png` });
  console.log('✅ Fleet grey cards captured');

  await browser.close();
})();
