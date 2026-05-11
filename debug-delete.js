const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/attempts/1/S01/E01',
  method: 'DELETE'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`First 300 chars: ${data.substring(0, 300)}`);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});

req.end();
