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
        console.log(`${method} ${path}: ${res.statusCode}`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error: ${e.message}`);
      resolve();
    });

    req.end();
  });
}

(async () => {
  await test('GET', '/api/studentphones');                     // base
  await test('GET', '/api/studentphones/student/S01');         // single param
  await test('GET', '/api/studentphones/S01/+92-300-1234567'); // composite
  process.exit(0);
})();
