const cars = require("./_cars"), db = require("./_db");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ errors: ["POST only"] });
  const { name, email, phone, carId, date, time } = req.body || {};
  const errors = [];
  if (!name || name.trim().length < 2) errors.push("Enter your full name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email || "")) errors.push("Enter a valid email.");
  if (!/^[+\d][\d\s-]{7,14}$/.test(phone || "")) errors.push("Enter a valid phone number.");
  if (!cars.find(c => c.id === carId)) errors.push("Choose a car.");
  if (!date || new Date(date) < new Date(new Date().toDateString())) errors.push("Choose a date from today onwards.");
  if (!db.TIMES.includes(time)) errors.push("Choose a time.");
  if (errors.length) return res.status(400).json({ errors });
  const b = { ref: "TD-" + Date.now().toString(36).toUpperCase(), name, email, phone, carId, date, time, at: new Date().toISOString() };
  const ok = await db.hsetnx("td", `${carId}|${date}|${time}`, JSON.stringify(b)); // atomic: two people can't take the same slot
  if (!ok) return res.status(409).json({ errors: ["That slot was just taken. Pick another time."] });
  res.status(201).json({ ref: b.ref });
};
