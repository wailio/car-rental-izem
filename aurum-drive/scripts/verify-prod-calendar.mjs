import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const bookingCard = page.locator(".rentgo-booking-card");
  await bookingCard.scrollIntoViewIfNeeded();

  // Click on Date de retrait to open calendar
  await page.click('text="Date de retrait"');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-prod-calendar-open.png",
    clip: { x: 120, y: 150, width: 1200, height: 600 }
  });
  console.log("Captured calendar open screenshot!");

  await browser.close();
}

main().catch(console.error);
