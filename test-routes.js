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
      console.error(`Error on ${method} ${path}: ${e.message}`);
      resolve();
    });

    req.end();
  });
}

(async () => {
  await test('GET', '/api/attempts');                     // Should work: 200
  await test('GET', '/api/attempts/1/S01/E01');          // Should work: my test route
  await test('DELETE', '/api/attempts/1/S01/E01');       // Should work: my DELETE route
  process.exit(0);
})();
