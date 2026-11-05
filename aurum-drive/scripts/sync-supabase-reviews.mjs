import { getSupabaseConfig } from '../src/lib/supabase-config.ts';
import { DEFAULT_SITE_CONFIG } from '../src/lib/site-config.ts';

async function syncToSupabase() {
  const { url, key } = getSupabaseConfig();
  console.log('Supabase URL:', url);
  if (!key) {
    console.error('No Supabase key found');
    process.exit(1);
  }

  // Fetch current config from public storage
  const publicUrl = `${url}/storage/v1/object/public/products/site-config.json`;
  let current = {};
  try {
    const res = await fetch(`${publicUrl}?t=${Date.now()}`);
    if (res.ok) {
      current = await res.json();
      console.log('Fetched existing Supabase config');
    }
  } catch (e) {
    console.warn('Could not fetch existing config:', e.message);
  }

  // Merge with updated DEFAULT_SITE_CONFIG
  const merged = {
    ...DEFAULT_SITE_CONFIG,
    ...current,
    reviews_badge: DEFAULT_SITE_CONFIG.reviews_badge,
    reviews_title: DEFAULT_SITE_CONFIG.reviews_title,
    reviews_subtitle: DEFAULT_SITE_CONFIG.reviews_subtitle,
    reviews_rating: DEFAULT_SITE_CONFIG.reviews_rating,
    reviews_items_json: DEFAULT_SITE_CONFIG.reviews_items_json,
    review_1_author: DEFAULT_SITE_CONFIG.review_1_author,
    review_1_vehicle: DEFAULT_SITE_CONFIG.review_1_vehicle,
    review_1_text: DEFAULT_SITE_CONFIG.review_1_text,
    review_2_author: DEFAULT_SITE_CONFIG.review_2_author,
    review_2_vehicle: DEFAULT_SITE_CONFIG.review_2_vehicle,
    review_2_text: DEFAULT_SITE_CONFIG.review_2_text,
    review_3_author: DEFAULT_SITE_CONFIG.review_3_author,
    review_3_vehicle: DEFAULT_SITE_CONFIG.review_3_vehicle,
    review_3_text: DEFAULT_SITE_CONFIG.review_3_text,
  };

  const uploadUrl = `${url}/storage/v1/object/products/site-config.json`;
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'x-upsert': 'true',
    },
    body: JSON.stringify(merged, null, 2),
  });

  if (uploadRes.ok) {
    console.log('✅ Successfully uploaded updated site-config.json to Supabase Storage!');
  } else {
    console.error('❌ Failed to upload:', uploadRes.status, await uploadRes.text());
  }
}

syncToSupabase().catch(console.error);
