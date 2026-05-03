// api/search.js
export default async function handler(req, res) {
  // CORS allow karein taake koi block na kare
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Backup APIs in case one fails
  const apiUrls = [
    `https://saavn.sumit.co/api/search/songs?query=${encodeURIComponent(query)}`,
    `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`,
    `https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${encodeURIComponent(query)}`
  ];

  for (let url of apiUrls) {
    try {
      const apiRes = await fetch(url);
      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.status(200).json(data);
      }
    } catch (e) {
      console.log(`Failed fetching from ${url}`);
    }
  }

  // Agar saari APIs fail ho jayen
  return res.status(500).json({ error: 'Failed to fetch songs from all sources.' });
}