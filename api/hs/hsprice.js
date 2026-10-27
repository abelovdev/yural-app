export default async function handler(req, res) {
  const apiKey = process.env.YURAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing YURAL_API_KEY' });
  }

  const queryParams = new URLSearchParams(req.query);
  queryParams.set('key', apiKey);

  const targetUrl = `https://api.favorit-parts.ru/hs/hsprice/?${queryParams.toString()}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await apiResponse.json();
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data from Favorit-parts' });
  }
}