export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://flo.tota-finance.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  const { key } = req.body;
  if (!key || typeof key !== 'string' || key.trim().length < 8) {
    return res.status(400).json({ valid: false, error: 'No key provided' });
  }

  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: 'odnyt',
        license_key: key.trim(),
        increment_uses_count: 'false'
      })
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(200).json({ valid: false, error: data.message || 'Invalid key' });
    }
  } catch (e) {
    return res.status(500).json({ valid: false, error: 'Verification failed' });
  }
}
