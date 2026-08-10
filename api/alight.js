export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: false, message: 'Method tidak didukung.' });
  }

  const { action, email, link, amount } = req.body || {};
  const amToken = process.env.AM_TOKEN;

  if (!amToken) {
    return res.status(500).json({ status: false, message: 'AM_TOKEN belum diatur di Environment Variables Vercel.' });
  }

  const ZNN_BASE = "https://api.znn.my.id";

  try {
    let url = '';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': amToken.startsWith('Bearer ') ? amToken : `Bearer ${amToken}`,
        'Accept': 'application/json',
        'User-Agent': 'thanz-znn-toolkit/2.0'
      }
    };

    if (action === 'send') {
      if (!email) return res.status(400).json({ status: false, message: 'Email diperlukan.' });
      url = `${ZNN_BASE}/alightmotion/send?email=${encodeURIComponent(email)}`;
    } else if (action === 'verify') {
      if (!email || !link) return res.status(400).json({ status: false, message: 'Email dan link diperlukan.' });
      url = `${ZNN_BASE}/alightmotion/verify?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}`;
    } else if (action === 'bulk') {
      const count = parseInt(amount) || 1;
      url = `${ZNN_BASE}/alightmotion/bulk?amount=${count}`;
    } else if (action === 'inbox') {
      if (!email) return res.status(400).json({ status: false, message: 'Email diperlukan.' });
      url = `${ZNN_BASE}/tempmail-read?email=${encodeURIComponent(email)}`;
    } else {
      return res.status(400).json({ status: false, message: 'Aksi tidak valid.' });
    }

    const response = await fetch(url, options);
    const rawText = await response.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { status: false, message: 'Respons API upstream tidak dapat dibaca.' };
    }

    return res.status(response.ok ? 200 : response.status || 400).json(data);
  } catch (err) {
    return res.status(502).json({ status: false, message: 'Gagal terhubung ke server upstream ZNN.' });
  }
}