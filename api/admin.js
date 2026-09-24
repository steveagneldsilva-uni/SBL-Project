const db = require("./_db");
module.exports = async (req, res) => {
  if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Wrong admin key." });
  const [td, od] = await Promise.all([db.hvals("td"), db.hvals("orders")]);
  res.status(200).json({ bookings: (td || []).map(JSON.parse), orders: (od || []).map(JSON.parse) });
};
