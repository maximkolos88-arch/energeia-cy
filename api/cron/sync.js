import https from 'https';

export default async function handler(request, response) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ trigger: 'vercel_cron_scheduler' });
    
    const options = {
      hostname: 'hook.eu1.make.com',
      port: 443,
      path: '/yhycl2rw6bgc2sfxnp5jjmor31cgxdii',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          response.status(200).json({ success: true, message: 'Sync triggered successfully.' });
        } else {
          response.status(res.statusCode).json({ success: false, error: `Make.com returned status: ${res.statusCode}` });
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('Cron sync error:', err);
      response.status(500).json({ success: false, error: err.message });
      resolve();
    });

    req.write(data);
    req.end();
  });
}
