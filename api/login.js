// Vercel Serverless Function untuk Validasi Admin Aman menggunakan Environment Variables
export default function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ status: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { username, token } = req.body || {};

    // Mengambil kredensial rahasia dari Environment Variables Server
    const secureAdminUser = process.env.ADMIN_USERNAME || "thanz";
    const secureAdminToken = process.env.ADMIN_TOKEN || "thanzadmin";

    if (username === secureAdminUser && token === secureAdminToken) {
      return res.status(200).json({
        status: true,
        role: "admin",
        message: "Autentikasi Admin Berhasil via Server Env."
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Username atau Access Key Admin salah."
      });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server." });
  }
}
