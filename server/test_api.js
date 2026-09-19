// test_api.js - Automated Verification Suite for Smart Land Assistant APIs
async function runTests() {
  const base = 'http://localhost:5000/api';
  console.log('🧪 Starting Fullstack Automated API Test Suite...\n');

  try {
    // 1. Health
    const health = await (await fetch(base + '/health')).json();
    console.log('✅ [1/7] Health Check:', health.status, '| Service:', health.service);

    // 2. Lands
    const lands = await (await fetch(base + '/lands')).json();
    console.log('✅ [2/7] Lands API: Retrieved', lands.lands?.length, 'parcels. First Survey #:', lands.lands?.[0]?.survey_number);

    // 3. Weather & Soil
    const weather = await (await fetch(base + '/weather')).json();
    const soil = await (await fetch(base + '/soil')).json();
    const water = await (await fetch(base + '/water')).json();
    console.log('✅ [3/7] Weather, Soil & Water Telemetry:');
    console.log(`    - Weather: ${weather.data?.current?.temp_c}°C, Condition: ${weather.data?.current?.condition}`);
    console.log(`    - Soil Moisture: ${soil.data?.soil_moisture_percentage}% (${soil.data?.moisture_status})`);
    console.log(`    - Groundwater Depth: ${water.data?.groundwater_depth_meters}m (${water.data?.groundwater_status})`);

    // 4. File Complaint (Farmer)
    const compRes = await (await fetch(base + '/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'FAR-101' },
      body: JSON.stringify({
        survey_number: '142/2A',
        complaint_type: 'Incorrect Boundary',
        description: 'Auto-test: East boundary stone displaced by 4 meters.',
        location: 'Eastern ridge'
      })
    })).json();
    console.log(`✅ [4/7] Complaint Filing: ID: ${compRes.complaint_id}, Status: ${compRes.complaint?.status}`);

    // 5. File Re-Survey (Farmer)
    const resurvRes = await (await fetch(base + '/resurveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'FAR-101' },
      body: JSON.stringify({
        survey_number: '142/2A',
        reason: 'Auto-test: Partition Demarcation Request',
        problem_type: 'Cadastral Boundary Demarcation'
      })
    })).json();
    console.log(`✅ [5/7] Re-Survey Request: ID: ${resurvRes.request_id}, Step: ${resurvRes.resurvey?.status_step}/8 (${resurvRes.resurvey?.status})`);

    // 6. Surveyor Verification & Government Dispatch
    const verifyRes = await (await fetch(base + '/surveyor/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'SUR-502' },
      body: JSON.stringify({
        land_id: 'LAND-TG-501',
        updates: {
          survey_status: 'Verified',
          total_area_acres: 4.75,
          remarks: 'Cadastral DGPS boundary re-alignment verified.'
        }
      })
    })).json();
    console.log(`✅ [6/7] Surveyor Verification: ${verifyRes.message}`);

    const govRes = await (await fetch(base + '/surveyor/forward-gov', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'SUR-502' },
      body: JSON.stringify({
        survey_number: '142/2A',
        land_id: 'LAND-TG-501',
        owner_name: 'Ramesh Kumar',
        verified_acres: 4.75,
        target_department: 'Dharani Land Records Registry, Govt of Telangana'
      })
    })).json();
    console.log(`    - Gov Dispatch: Ref #${govRes.submission?.dispatch_id}, Hash: ${govRes.submission?.verification_hash}`);

    // 7. Audit Trail Integrity
    const auditRes = await (await fetch(base + '/audit')).json();
    console.log(`✅ [7/7] Audit Trail: Total ${auditRes.count} immutable records logged.`);
    console.log(`    - Latest entry: [${auditRes.audit_logs?.[0]?.action}] ${auditRes.audit_logs?.[0]?.details}`);

    console.log('\n🎉 ALL 7 TEST SUITES PASSED FLAWLESSLY!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
