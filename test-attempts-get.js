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
        console.log(`${method} ${path}: ${res.statusCode}`);
        console.log(`  First 150 chars: ${data.substring(0, 150)}`);
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
  console.log('Checking if GET attempts works with path params...\n');
  
  // First, get all attempts to see what IDs we have
  await makeRequest('GET', '/api/attempts');
  
  console.log('\n');
  process.exit(0);
})();
