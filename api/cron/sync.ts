export default async function handler(req: any, res: any) {
  try {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || '';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'vercel_cron_scheduler' }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Sync triggered successfully.' });
    } else {
      return res.status(response.status).json({ 
        success: false, 
        error: `Make.com returned status: ${response.status}` 
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
