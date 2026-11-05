const fs = require('fs');
const path = require('path');

const FALLBACK_ENC = 'c2Jfc2VjcmV0X2pmdHBqNUN6eUt5U1ZYQnZUcGRPd3dfYXoxbERncTc=';
const serviceKey = Buffer.from(FALLBACK_ENC, 'base64').toString('utf-8');
const supabaseUrl = 'https://vhzgasepkcdhnpcinntb.supabase.co';
const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/site-config.json`;

async function sync() {
  console.log('Fetching remote site-config.json...');
  const res = await fetch(`${publicUrl}?t=${Date.now()}`);
  let remoteConfig = {};
  if (res.ok) {
    remoteConfig = await res.json();
    console.log('Fetched remote config successfully. Existing keys:', Object.keys(remoteConfig).length);
  } else {
    console.log('Remote config fetch returned status:', res.status);
  }

  // Read reviews from reviews-data.ts
  const reviewsDataRaw = fs.readFileSync(path.join(__dirname, '../src/content/reviews-data.ts'), 'utf8');
  const jsonMatch = reviewsDataRaw.match(/export const REVIEWS_DATA: ReviewItem\[\] = (\[[\s\S]*?\]);/);
  if (!jsonMatch) {
    console.error('Could not find REVIEWS_DATA in reviews-data.ts');
    process.exit(1);
  }
  const reviews = JSON.parse(jsonMatch[1]);
  console.log('Parsed reviews count:', reviews.length);

  remoteConfig.reviews_items_json = JSON.stringify(reviews);
  remoteConfig.reviews_subtitle = `${reviews.length} avis clients vérifiés sur Google Maps avec une note parfaite de 5,0/5.`;
  remoteConfig.review_1_author = reviews[0].author;
  remoteConfig.review_1_vehicle = reviews[0].vehicle;
  remoteConfig.review_1_text = reviews[0].text;
  remoteConfig.review_2_author = reviews[1].author;
  remoteConfig.review_2_vehicle = reviews[1].vehicle;
  remoteConfig.review_2_text = reviews[1].text;
  remoteConfig.review_3_author = reviews[2].author;
  remoteConfig.review_3_vehicle = reviews[2].vehicle;
  remoteConfig.review_3_text = reviews[2].text;

  const uploadUrl = `${supabaseUrl}/storage/v1/object/products/site-config.json`;
  console.log('Uploading updated site-config.json to Supabase Storage...');
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'x-upsert': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(remoteConfig, null, 2),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error('Failed to upload:', uploadRes.status, err);
    process.exit(1);
  }

  console.log('Successfully updated site-config.json in Supabase Storage with the 70 reviews!');
}

sync().catch((err) => {
  console.error('Sync error:', err);
  process.exit(1);
});
