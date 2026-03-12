const http = require('http');

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function test() {
  console.log('Testing Admin Login...');
  try {
    const result = await postJSON('http://localhost:5000/api/admin/login', {
      email: 'hello@ashutoshranjan.com',
      password: 'admin123'
    });
    console.log('Login Result:', JSON.stringify(result, null, 2));
  } catch(e) {
    console.error('Login Error:', e.message);
  }

  console.log('\nTesting Contact API...');
  try {
    const result = await postJSON('http://localhost:5000/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    });
    console.log('Contact Result:', JSON.stringify(result, null, 2));
  } catch(e) {
    console.error('Contact Error:', e.message);
  }

  console.log('\nTesting Newsletter API...');
  try {
    const result = await postJSON('http://localhost:5000/api/newsletter/subscribe', {
      email: 'test@example.com'
    });
    console.log('Newsletter Result:', JSON.stringify(result, null, 2));
  } catch(e) {
    console.error('Newsletter Error:', e.message);
  }
}

test();
