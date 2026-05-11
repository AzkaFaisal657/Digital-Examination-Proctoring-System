const http = require('http');

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`${method} ${path}: ${res.statusCode}`);
          console.log(`  Response: ${JSON.stringify(json).substring(0, 100)}`);
        } catch (e) {
          console.log(`${method} ${path}: ${res.statusCode} (non-JSON response)`);
        }
        resolve({ status: res.statusCode });
      });
    });

    req.on('error', (e) => {
      console.log(`${method} ${path}: ERROR - ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

(async () => {
  console.log('Testing routing...\n');
  
  // Test simple single-key DELETE (exams - should work)
  await makeRequest('DELETE', '/api/exams/E01');
  
  // Test composite key DELETE (attempts - my fix)
  await makeRequest('DELETE', '/api/attempts/1/S01/E01');
  
  // Test composite key DELETE (studentphones - should already work)
  await makeRequest('DELETE', '/api/studentphones/S01/+92-300-1234567');
  
  console.log('\nDone!');
  process.exit(0);
})();
