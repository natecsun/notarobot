/**
 * Test script for Photo Security API
 * Run: node scripts/test-photo-api.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.argv[2] || 'http://localhost:3000';

async function testPhotoAPI() {
  console.log(`\n🔍 Testing Photo Security API at ${BASE_URL}\n`);
  console.log('=' .repeat(50));

  // Test 1: Check if the page loads
  console.log('\n📄 Test 1: Photo service page accessibility');
  try {
    const pageRes = await fetch(`${BASE_URL}/services/photo`);
    if (pageRes.ok) {
      console.log('   ✅ Page loads successfully (status:', pageRes.status, ')');
    } else {
      console.log('   ❌ Page failed to load (status:', pageRes.status, ')');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 2: API without auth (should return 401)
  console.log('\n🔐 Test 2: API authentication check');
  try {
    const formData = new FormData();
    // Create a minimal test image (1x1 red pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    const apiRes = await fetch(`${BASE_URL}/api/photo`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await apiRes.json();
    
    if (apiRes.status === 401) {
      console.log('   ✅ Correctly returns 401 for unauthenticated request');
      console.log('   📝 Message:', data.error);
    } else if (apiRes.status === 403) {
      console.log('   ✅ Returns 403 (authenticated but insufficient credits)');
      console.log('   📝 Message:', data.error);
    } else {
      console.log('   ⚠️  Unexpected status:', apiRes.status);
      console.log('   📝 Response:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 3: Check pricing page has photo security
  console.log('\n💰 Test 3: Pricing page includes photo security');
  try {
    const pricingRes = await fetch(`${BASE_URL}/pricing`);
    const html = await pricingRes.text();
    
    if (html.includes('Anti AI Spy') || html.includes('photo security') || html.includes('Photo Security')) {
      console.log('   ✅ Photo security mentioned on pricing page');
    } else {
      console.log('   ❌ Photo security NOT found on pricing page');
    }
    
    if (html.includes('3.99')) {
      console.log('   ✅ $3.99 price point found');
    } else {
      console.log('   ⚠️  $3.99 price not explicitly found');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 4: Check homepage has photo security card
  console.log('\n🏠 Test 4: Homepage includes photo security card');
  try {
    const homeRes = await fetch(`${BASE_URL}/`);
    const html = await homeRes.text();
    
    if (html.includes('/services/photo')) {
      console.log('   ✅ Link to photo service found on homepage');
    } else {
      console.log('   ❌ Link to photo service NOT found');
    }
    
    if (html.includes('Anti AI Spy')) {
      console.log('   ✅ "Anti AI Spy" branding found');
    } else {
      console.log('   ⚠️  "Anti AI Spy" branding not found');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 5: Check checkout API accepts photo_security type
  console.log('\n💳 Test 5: Checkout API photo_security type');
  try {
    const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'photo_security' }),
    });
    
    const data = await checkoutRes.json();
    
    if (checkoutRes.status === 401) {
      console.log('   ✅ Checkout requires auth (expected for unauthenticated)');
    } else if (data.url && data.url.includes('stripe')) {
      console.log('   ✅ Stripe checkout URL generated');
    } else {
      console.log('   ⚠️  Status:', checkoutRes.status);
      console.log('   📝 Response:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Basic tests complete!\n');
  console.log('📋 Manual testing needed:');
  console.log('   1. Log in and upload a real photo');
  console.log('   2. Verify image analysis detects location markers');
  console.log('   3. Verify image modification produces different output');
  console.log('   4. Test payment flow with Stripe test mode');
  console.log('');
}

testPhotoAPI().catch(console.error);
