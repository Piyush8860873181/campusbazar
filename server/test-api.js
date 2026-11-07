// test-api.js - Automated integration test for all CampusBazar REST API endpoints
require('dotenv').config();
const http = require('http');

let baseUrl = 'http://localhost:5000';
let authToken = '';
let userId = '';
let testListingId = '';

const request = (path, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n🧪 ==========================================');
  console.log('🧪 RUNNING COMPREHENSIVE CAMPUSBAZAR API TESTS');
  console.log('🧪 Targeting: ' + baseUrl);
  console.log('🧪 ==========================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200 && healthRes.data.status === 'healthy', 'GET /api/health returns 200 and healthy status');

    // 2. User registration
    const testEmail = `test_${Date.now()}@campusbazar.com`;
    const regRes = await request('/api/auth/register', { method: 'POST' }, {
      name: 'Test Student',
      email: testEmail,
      password: 'password123',
      phone: '9876543210',
      city: 'Delhi',
      role: 'college student',
    });
    assert(regRes.status === 201 && regRes.data.token, 'POST /api/auth/register registers new user and returns JWT');
    authToken = regRes.data.token;
    userId = regRes.data.user._id;

    // 3. User login
    const loginRes = await request('/api/auth/login', { method: 'POST' }, {
      email: testEmail,
      password: 'password123',
    });
    assert(loginRes.status === 200 && loginRes.data.token, 'POST /api/auth/login authenticates user');

    // 4. Get current user profile
    const meRes = await request('/api/auth/me');
    assert(meRes.status === 200 && meRes.data.user.email === testEmail, 'GET /api/auth/me returns current user details');

    // 5. Update profile
    const updateRes = await request('/api/users/profile', { method: 'PUT' }, {
      name: 'Updated Student Name',
      city: 'Mumbai',
    });
    assert(updateRes.status === 200 && updateRes.data.user.name === 'Updated Student Name', 'PUT /api/users/profile updates profile');

    // 6. Create Listing
    const createRes = await request('/api/listings', { method: 'POST' }, {
      title: 'Test Engineering Mathematics Book',
      description: 'Used textbook for 1st sem engineering, complete and intact.',
      category: 'College Books',
      subCategory: '1st Year B.Tech',
      condition: 'Like New',
      price: 350,
      negotiable: true,
      city: 'Mumbai',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    });
    assert(createRes.status === 201 && createRes.data.listing._id, 'POST /api/listings creates new listing');
    testListingId = createRes.data.listing._id;

    // 7. Get Listings with Search & Filter
    const listRes = await request('/api/listings?q=Engineering&category=College Books&sort=price-asc');
    assert(listRes.status === 200 && Array.isArray(listRes.data.listings), 'GET /api/listings supports search, category, sort and returns array');

    // 8. Get Listing by ID
    const singleRes = await request(`/api/listings/${testListingId}`);
    assert(singleRes.status === 200 && singleRes.data.listing.title.includes('Engineering'), 'GET /api/listings/:id returns listing with seller');

    // 9. Update Listing
    const editRes = await request(`/api/listings/${testListingId}`, { method: 'PUT' }, {
      price: 300,
      negotiable: false,
    });
    assert(editRes.status === 200 && editRes.data.listing.price === 300, 'PUT /api/listings/:id updates listing');

    // 10. Toggle Sold Status
    const soldRes = await request(`/api/listings/${testListingId}/sold`, { method: 'PATCH' });
    assert(soldRes.status === 200 && soldRes.data.listing.isSold === true, 'PATCH /api/listings/:id/sold toggles isSold status');

    // 11. Get My Listings
    const mineRes = await request('/api/listings/mine');
    assert(mineRes.status === 200 && mineRes.data.listings.length >= 1, 'GET /api/listings/mine returns user listings');

    // 12. Wishlist toggle
    const wishRes = await request(`/api/wishlist/${testListingId}`, { method: 'POST' });
    assert(wishRes.status === 200 && wishRes.data.isAdded === true, 'POST /api/wishlist/:id adds item to wishlist');

    // 13. Get Wishlist
    const getWishRes = await request('/api/wishlist');
    assert(getWishRes.status === 200 && getWishRes.data.listings.length >= 1, 'GET /api/wishlist returns populated wishlist');

    // 14. Inquiries: Register 2nd user to send inquiry
    const buyerEmail = `buyer_${Date.now()}@campusbazar.com`;
    const buyerReg = await request('/api/auth/register', { method: 'POST' }, {
      name: 'Second Buyer Student',
      email: buyerEmail,
      password: 'password123',
      phone: '9988776655',
      city: 'Delhi',
      role: 'school student',
    });
    const buyerToken = buyerReg.data.token;

    // Send inquiry from buyer to seller
    const inqRes = await request(
      '/api/inquiries',
      { method: 'POST', headers: { Authorization: `Bearer ${buyerToken}` } },
      {
        listingId: testListingId,
        message: 'Hello, is this item still available? Can we negotiate on price?',
      }
    );
    assert(inqRes.status === 201 && inqRes.data.inquiry._id, 'POST /api/inquiries sends inquiry to seller');

    // Check seller inbox (with original authToken)
    const inboxRes = await request('/api/inquiries/received');
    assert(inboxRes.status === 200 && inboxRes.data.inquiries.length >= 1, 'GET /api/inquiries/received returns inquiries in seller inbox');

    // 15. Delete Listing
    const delRes = await request(`/api/listings/${testListingId}`, { method: 'DELETE' });
    assert(delRes.status === 200 && delRes.data.success === true, 'DELETE /api/listings/:id removes listing');

    console.log('\n=============================================');
    console.log(`🎯 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
