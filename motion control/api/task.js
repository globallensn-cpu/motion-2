// api/task.js — Vercel Serverless Function (CommonJS)
// Secure proxy: fetches task status from Magnific API

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { taskId, tier, apiKey } = req.query || {};

    if (!taskId)  return res.status(400).json({ message: 'Missing query param: taskId' });
    if (!apiKey)  return res.status(400).json({ message: 'Missing query param: apiKey' });

    const currentTier = tier === 'std' ? 'std' : 'pro';
    const apiUrl = `https://api.magnific.com/v1/ai/video/kling-v3-motion-control-${currentTier}/${encodeURIComponent(taskId)}`;

    const upstream = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'x-magnific-api-key': apiKey },
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        message: data.message || `Magnific API returned ${upstream.status}`,
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[task] error:', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};
