export default async function handler(request, response) {
  try {
    const makeRes = await fetch('https://hook.eu1.make.com/yhycl2rw6bgc2sfxnp5jjmor31cgxdii', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trigger: 'vercel_cron_scheduler' })
    });

    if (!makeRes.ok) {
      throw new Error(`Make.com returned status: ${makeRes.status}`);
    }

    return response.status(200).json({ success: true, message: 'Sync triggered successfully.' });
  } catch (err) {
    console.error('Cron sync error:', err);
    return response.status(500).json({ success: false, error: err.message });
  }
}
