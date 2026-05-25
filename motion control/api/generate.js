// api/generate.js — Vercel Serverless Function (CommonJS)
// Secure proxy: forwards video generation request to Magnific API

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { imageUrl, videoUrl, prompt, characterOrientation, cfgScale, tier, webhookUrl, apiKey } = body;

    if (!imageUrl) return res.status(400).json({ message: 'Missing imageUrl (character image URL)' });
    if (!videoUrl) return res.status(400).json({ message: 'Missing videoUrl (reference video URL)' });
    if (!apiKey)   return res.status(400).json({ message: 'Missing Magnific API key' });

    const currentTier = tier === 'std' ? 'std' : 'pro';
    const apiUrl = `https://api.magnific.com/v1/ai/video/kling-v3-motion-control-${currentTier}`;

    const requestBody = {
      image_url: imageUrl,
      video_url: videoUrl,
      character_orientation: characterOrientation || 'video',
      cfg_scale: cfgScale !== undefined ? Math.max(0, Math.min(1, Number(cfgScale))) : 0.5,
    };
    if (prompt && String(prompt).trim())       requestBody.prompt = String(prompt).trim();
    if (webhookUrl && String(webhookUrl).trim()) requestBody.webhook_url = String(webhookUrl).trim();

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magnific-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        message: data.message || `Magnific API returned ${upstream.status}`,
        details: data,
      });
    }

    return res.status(200).json({
      taskId: data.task_id || data.id || data.taskId || null,
      status: data.status || 'CREATED',
      raw: data,
    });
  } catch (err) {
    console.error('[generate] error:', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};
