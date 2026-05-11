const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/attempts/1/S01/E01',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`GET /api/attempts/1/S01/E01: ${res.statusCode}`);
    console.log(`Response: ${data.substring(0, 200)}`);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});

req.end();
