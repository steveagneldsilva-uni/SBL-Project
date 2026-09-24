const db = require("./_db");
module.exports = async (req, res) => {
  const { carId, date } = req.query;
  const taken = [];
  for (const t of db.TIMES) if (await db.hget("td", `${carId}|${date}|${t}`)) taken.push(t);
  res.status(200).json({ times: db.TIMES, taken });
};
