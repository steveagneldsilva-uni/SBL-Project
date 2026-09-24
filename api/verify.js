const Stripe = require("stripe"), db = require("./_db");
module.exports = async (req, res) => {
  try {
    const s = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(req.query.session_id);
    if (s.payment_status !== "paid") return res.status(402).json({ error: "Payment not completed." });
    const o = { ref: "PO-" + s.id.slice(-8).toUpperCase(), carId: s.metadata.carId, color: s.metadata.color, email: s.customer_details && s.customer_details.email, amount: s.amount_total / 100, at: new Date().toISOString() };
    await db.hsetnx("orders", s.id, JSON.stringify(o)); // idempotent: refreshing the page never duplicates the order
    res.status(200).json(o);
  } catch (e) { res.status(400).json({ error: "Could not verify payment." }); }
};
