import { sendJson, onlyPost, cleanString } from "./_upstream.js";

export default async function handler(req, res) {
  if (!onlyPost(req, res)) return;

  const username = cleanString(req.body.username, 100);
  const token = cleanString(req.body.token, 100);

  // Ambil kredensial admin dari Vercel Environment Variables
  const adminUser = cleanString(process.env.ADMIN_USERNAME, 100) || "thanz";
  const adminPass = cleanString(process.env.ADMIN_TOKEN, 100) || "thanzadmin";

  if (username === adminUser && token === adminPass) {
    return sendJson(res, 200, {
      status: true,
      message: "Admin authenticated successfully."
    });
  }

  return sendJson(res, 401, {
    status: false,
    message: "Username atau password admin salah."
  });
}
