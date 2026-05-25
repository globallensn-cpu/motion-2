// api/validate-key.js — Vercel Serverless Function (CommonJS)
// Validates a Magnific API key by making a lightweight list request

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { apiKey } = body;

    if (!apiKey) return res.status(400).json({ message: 'Missing apiKey in request body' });

    // Use a lightweight GET list endpoint — a 401 means invalid key,
    // any other status (200, 400, 429, 403) means the key is authenticated.
    const apiUrl = 'https://api.magnific.com/v1/ai/video/kling-v3-motion-control-pro';
    const upstream = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'x-magnific-api-key': apiKey },
    });

    const valid = upstream.status !== 401;
    const statusNote = valid
      ? `Key authenticated (HTTP ${upstream.status})`
      : 'Key rejected: 401 Unauthorized';

    return res.status(200).json({ valid, statusNote });
  } catch (err) {
    console.error('[validate-key] error:', err);
    return res.status(200).json({ valid: false, statusNote: `Network error: ${err.message}` });
  }
};
