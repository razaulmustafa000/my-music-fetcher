// api/search.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Yahan humne &limit=40 add kar diya hai taake 20+ songs lazmi aayein
  const apiUrls = [
    `https://saavn.sumit.co/api/search/songs?query=${encodeURIComponent(query)}&limit=40`,
    `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=40`,
    `https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${encodeURIComponent(query)}&limit=40`
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

  return res.status(500).json({ error: 'Failed to fetch songs from all sources.' });
}
