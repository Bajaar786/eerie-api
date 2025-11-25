const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function testAPI() {
  console.log('🧪 Testing Eerie API Endpoints\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Health Check');
    const health = await axios.get('http://localhost:3000/health');
    console.log('   ✅', health.data.message);
    console.log();

    // 2. Get Entity Stats
    console.log('2️⃣  Entity Statistics');
    const stats = await axios.get(`${BASE_URL}/entities/stats`);
    console.log('   📊 Total Entities:', stats.data.total);
    console.log('   📊 Average Threat Level:', stats.data.averageThreatLevel.toFixed(2));
    console.log('   📊 Most Dangerous:', stats.data.mostDangerous[0].name);
    console.log();

    // 3. Search Cryptids
    console.log('3️⃣  Search for Cryptids (Threat Level 5+)');
    const cryptids = await axios.get(`${BASE_URL}/entities/search`, {
      params: {
        classification: 'Cryptid',
        minThreatLevel: 5
      }
    });
    console.log(`   🔍 Found ${cryptids.data.length} cryptids:`);
    cryptids.data.forEach(e => {
      console.log(`      - ${e.name} (Threat: ${e.threatLevel})`);
    });
    console.log();

    // 4. Get All Locations
    console.log('4️⃣  Get All Locations');
    const locations = await axios.get(`${BASE_URL}/locations`);
    console.log(`   📍 Found ${locations.data.length} locations:`);
    locations.data.slice(0, 3).forEach(l => {
      console.log(`      - ${l.name}, ${l.city}, ${l.country}`);
    });
    console.log();

    // 5. Get All Incidents
    console.log('5️⃣  Get All Incidents');
    const incidents = await axios.get(`${BASE_URL}/incidents`);
    console.log(`   📝 Found ${incidents.data.length} incidents:`);
    incidents.data.forEach(i => {
      console.log(`      - ${i.title} (${i.status})`);
    });
    console.log();

    // 6. Register New User
    console.log('6️⃣  Register New User');
    try {
      const register = await axios.post(`${BASE_URL}/auth/register`, {
        email: `test${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: 'password123'
      });
      authToken = register.data.token;
      console.log('   ✅ User registered:', register.data.user.username);
      console.log('   🔑 Token received');
      console.log();
    } catch (err) {
      console.log('   ⚠️  Registration skipped (user may exist)');
      console.log();
    }

    // 7. Login
    console.log('7️⃣  Login as Admin');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@eerie-api.com',
      password: 'admin123'
    });
    authToken = login.data.token;
    console.log('   ✅ Logged in as:', login.data.user.username);
    console.log('   👤 Role:', login.data.user.role);
    console.log();

    // 8. Entity Compatibility Calculator
    console.log('8️⃣  Entity Compatibility Calculator');
    const allEntities = await axios.get(`${BASE_URL}/entities`);
    const entity1 = allEntities.data[0];
    const entity2 = allEntities.data[1];
    
    const compatibility = await axios.post(`${BASE_URL}/entities/compatibility`, {
      entity1Id: entity1.id,
      entity2Id: entity2.id
    });
    
    console.log(`   🧬 Testing: ${compatibility.data.entity1} + ${compatibility.data.entity2}`);
    console.log(`   📊 Compatibility Score: ${compatibility.data.compatibilityScore}/100`);
    console.log(`   💡 Analysis: ${compatibility.data.analysis}`);
    if (compatibility.data.warnings.length > 0) {
      console.log(`   ⚠️  Warnings:`);
      compatibility.data.warnings.forEach(w => console.log(`      - ${w}`));
    }
    console.log();

    // 9. Create New Incident (Authenticated)
    console.log('9️⃣  Create New Incident (Authenticated)');
    const newIncident = await axios.post(
      `${BASE_URL}/incidents`,
      {
        title: 'Test Sighting - API Demo',
        description: 'This is a test incident created via API',
        severity: 5,
        witnesses: 2,
        evidence: ['test_photo.jpg'],
        entityId: entity1.id,
        locationId: locations.data[0].id
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('   ✅ Incident created:', newIncident.data.title);
    console.log('   📋 Status:', newIncident.data.status);
    console.log();

    // 10. Search by Location
    console.log('🔟 Search Entities by Location');
    const locationSearch = await axios.get(`${BASE_URL}/entities/search`, {
      params: { location: 'Scotland' }
    });
    console.log(`   🔍 Entities in Scotland: ${locationSearch.data.length}`);
    locationSearch.data.forEach(e => {
      console.log(`      - ${e.name}`);
    });
    console.log();

    console.log('✅ All tests completed successfully!');
    console.log('\n📚 Check API_DOCUMENTATION.md for full endpoint details');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();
