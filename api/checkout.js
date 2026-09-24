const Stripe = require("stripe"), cars = require("./_cars");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { id, color } = req.body || {};
  const car = cars.find(c => c.id === id);
  if (!car) return res.status(400).json({ error: "Unknown car." });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.origin || `https://${req.headers.host}`;
    const s = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: 50000, product_data: { name: `Pre-order deposit: ${car.name} (${color || "Any colour"})` } } }],
      metadata: { carId: car.id, color: color || "Any" },
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?paid=0`
    });
    res.status(200).json({ url: s.url });
  } catch (e) { console.error(e); res.status(500).json({ error: "Payment could not start. Try again." }); }
};
