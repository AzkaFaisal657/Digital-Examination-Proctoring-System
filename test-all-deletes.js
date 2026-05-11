const http = require('http');

async function test(method, path) {
  return new Promise((resolve) => {
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
          console.log(`${method} ${path}: ${res.statusCode} ✓ JSON response`);
        } catch {
          console.log(`${method} ${path}: ${res.statusCode} ✗ HTML response`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`${method} ${path}: ERROR - ${e.message}`);
      resolve();
    });

    req.end();
  });
}

(async () => {
  // Test a working composite delete (studentphones)
  await test('DELETE', '/api/studentphones/S01/test-phone');
  
  // Test results (should now work with fixed route)
  await test('DELETE', '/api/results/R01/1/S01');
  
  // Test attempts (should now work with fixed route)
  await test('DELETE', '/api/attempts/1/S01/E01');
  
  process.exit(0);
})();
