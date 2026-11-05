// ─── Content QA Script ────────────────────────────────────────────────────────
// Fails if banned luxury clichés, English leftovers, fake template names,
// hardcoded dates, or malformed links are found in src/

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const rules = {
  banned: [
    /d['’]exception/i,
    /excellence/i,
    /prestig/i,
    /\bVIP\b/,
    /luxueu/i,
    /sur mesure/i,
    /sans compromis/i,
    /rigueur/i,
    /\bélite\b/i,
    /haut de gamme/i,
    /raffinement/i,
    /comblés/i,
    /lorem/i,
  ],
  english: [
    /Explore our/i,
    /Enhance your/i,
    /Watch Full Video/i,
    /View All/i,
    /What our customers/i,
    /Discover the ease/i,
    /Car Rental With Driver/i,
  ],
  template: [
    /Leslie Alexander/,
    /Floyd Miles/,
    /Courtney Henry/,
    /Robert Fox/,
    /Annette Black/,
    /Alis White/,
    /nova ride/i,
  ],
  hardcoded: [
    /pickup_at=20\d\d/,
    /return_at=20\d\d/,
  ],
  badLinks: [
    /href=["']\/\d{9,}/,
    /Octo\./,
  ],
};

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let failures = 0;
for (const file of walk('src')) {
  if (!/\.(tsx?|css|json|md)$/.test(file)) continue;
  // Skip QA script checking itself
  if (file.includes('content-qa')) continue;
  // Skip internal back-office admin files and data
  if (file.includes('\\admin\\') || file.includes('/admin/') || file.includes('products.ts') || file.includes('site-config.ts')) continue;
  
  const text = readFileSync(file, 'utf8');
  for (const [label, list] of Object.entries(rules)) {
    for (const re of list) {
      const m = text.match(re);
      if (m) {
        failures++;
        console.error(`❌ [${label}] ${file}: found "${m[0]}"`);
      }
    }
  }
}

if (failures > 0) {
  console.error(`\n🚨 Content QA failed: ${failures} issue(s) found in src/`);
  process.exit(1);
}

console.log('✅ Content QA passed: zero banned words, English leftovers, or template data found.');
