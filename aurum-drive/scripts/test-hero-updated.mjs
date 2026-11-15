import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const bookingCard = page.locator(".rentgo-booking-card");
  await bookingCard.scrollIntoViewIfNeeded();

  await bookingCard.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-hero-booking-perfect.png",
  });
  console.log("Captured updated booking bar screenshot successfully!");

  await browser.close();
}

main().catch(console.error);
