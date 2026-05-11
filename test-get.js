const http = require('http');

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`${method} ${path}: ${res.statusCode}`);
        resolve({ status: res.statusCode, data });
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
  console.log('Testing GET endpoints...\n');
  
  await makeRequest('GET', '/api/results');
  await makeRequest('GET', '/api/attempts');
  await makeRequest('GET', '/api/violations');
  
  console.log('\nNow testing DELETE...\n');
  
  await makeRequest('DELETE', '/api/results/R01/1/S01');
  await makeRequest('DELETE', '/api/attempts/1/S01/E01');
  await makeRequest('DELETE', '/api/violations/V01/ES01');
  
  console.log('\nDone!');
  process.exit(0);
})();
