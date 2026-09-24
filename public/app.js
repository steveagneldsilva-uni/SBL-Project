const $ = s => document.querySelector(s);
const money = n => "$" + Math.round(n).toLocaleString("en-US");
const api = (u, b) => fetch(u, b && { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) })
  .then(async r => { const d = await r.json(); if (!r.ok) throw d; return d; });
let cars = [], cmp = [], cur = null, ci = 0, st = { type: "All", q: "", sort: "price-asc", brand: "All" };
let saved = []; try { saved = JSON.parse(localStorage.getItem("saved") || "[]"); } catch (e) {}
const persist = () => { try { localStorage.setItem("saved", JSON.stringify(saved)); } catch (e) {} };
const toast = t => { const el = $("#toast"); el.textContent = t; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 5000); };
const svg = (h, body = "sedan") => `<svg viewBox="0 0 220 80" aria-hidden="true"><path d="${{sedan:"M8 58c0-8 6-12 14-14l30-6 26-20c4-3 9-4 14-4h42c8 0 14 3 20 10l16 14c14 2 30 6 30 18v6H8z",suv:"M8 58V44c0-6 4-10 10-12l22-6 14-16c3-3 7-4 11-4h58c6 0 10 2 14 6l14 14c10 2 24 6 24 16v16H8z",hatchback:"M10 58c0-8 5-12 12-14l26-6 20-18c4-3 8-4 12-4h36c8 0 12 3 16 8l10 14c14 2 28 6 28 16v4H10z",sports:"M6 60c0-6 4-10 12-12l44-8 32-14c6-2 12-3 18-3h26c8 0 14 3 20 8l24 14c12 2 28 6 28 14v2H6z",truck:"M6 40h84V22c0-3 2-4 5-4h34c5 0 9 2 12 6l14 16c10 2 20 6 20 14v6H6z"}[body.toLowerCase()]}" fill="${h}" opacity=".92"/><path d="M60 30h50" stroke="#fff" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/><circle cx="58" cy="60" r="13" fill="#0a1220" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><circle cx="168" cy="60" r="13" fill="#0a1220" stroke="#fff" stroke-opacity=".5" stroke-width="3"/></svg>`;

function render() {
  const types = ["All", ...new Set(cars.map(c => c.body)), "Electric", "Saved"];
  $("#tabs").innerHTML = types.map(t => `<button class="${t === st.type ? "on" : ""}" data-t="${t}">${t}${t === "Saved" ? " (" + saved.length + ")" : ""}</button>`).join("");
  $("#brands").innerHTML = ["All", ...new Set(cars.map(c => c.brand))].map(b => `<button class="${b === st.brand ? "on" : ""}" data-brand="${b}">${b === "All" ? "All brands" : b}</button>`).join("");
  const [k, d] = st.sort.split("-");
  const list = cars.filter(c => (st.type === "All" || (st.type === "Saved" ? saved.includes(c.id) : st.type === "Electric" ? c.fuel === "Electric" : c.body === st.type)) && (st.brand === "All" || c.brand === st.brand) && c.name.toLowerCase().includes(st.q.toLowerCase()))
    .sort((a, b) => (a[k] - b[k]) * (d === "asc" ? 1 : -1));
  $("#grid").innerHTML = list.map(c => `<article class="glass card car">
    <button class="heart ${saved.includes(c.id) ? "on" : ""}" data-save="${c.id}" aria-label="Save ${c.name}">${saved.includes(c.id) ? "♥" : "♡"}</button>
    <div class="stage">${svg(c.colors[0].h, c.body)}</div><h3>${c.name}</h3><div class="t">${c.body} · ${c.fuel} · ${c.seats} seats</div><div class="p">${money(c.price)}</div>
    <div class="spec"><span>${c.rangeKm} km</span><span>${c.hp} hp</span><span>0-100 in ${c.accel}s</span></div>
    <label class="cmp"><input type="checkbox" data-cmp="${c.id}" ${cmp.includes(c.id) ? "checked" : ""}> Compare</label>
    <div class="row"><button class="btn" data-view="${c.id}">Details</button><button class="btn ghost" data-drive="${c.id}">Test drive</button></div></article>`).join("")
    || `<p class="t">No cars match. Clear the search or pick another type.</p>`;
  $("#cmpbar").classList.toggle("show", cmp.length > 0); $("#cmpn").textContent = `${cmp.length} selected`;
  $("#cmpgo").disabled = cmp.length < 2;
}

function calc() {
  const p = cur.price, down = +$("#dn").value, n = +$("#tm").value, r = +$("#ap").value / 1200, loan = p * (1 - down / 100);
  const m = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  $("#dv").textContent = down + "% (" + money(p * down / 100) + ")"; $("#tv").textContent = n + " months"; $("#av").textContent = $("#ap").value + "%";
  $("#mo").textContent = money(m) + " / month";
}
function showDetail(id) {
  cur = cars.find(c => c.id === id); ci = 0; const c = cur;
  $("#detail").innerHTML = `<div class="dgrid"><div class="big"><div class="stage">${svg(c.colors[0].h, c.body)}</div><h3>${c.name}</h3><div class="t">${c.body} · ${c.fuel} · ${c.seats} seats</div><div class="p">${money(c.price)}</div>
    <b>Colour: <span id="cn">${c.colors[0].n}</span></b><div class="sw">${c.colors.map((x, i) => `<button class="${i ? "" : "on"}" data-col="${i}" style="background:${x.h}" aria-label="${x.n}"></button>`).join("")}</div>
    <ul class="f">${c.features.map(f => `<li>${f}</li>`).join("")}</ul></div>
    <div><h3>Monthly payment</h3><div class="glass calc">
      <label>Down payment <b id="dv"></b><input type="range" id="dn" min="0" max="50" step="5" value="20"></label>
      <label>Term <b id="tv"></b><input type="range" id="tm" min="24" max="84" step="12" value="60"></label>
      <label>Interest rate <b id="av"></b><input type="range" id="ap" min="0" max="15" step="0.5" value="6.5"></label><div class="mo" id="mo"></div></div>
    <div class="row"><button class="btn" id="pre">Pre-order for $500</button><button class="btn ghost" data-drive="${c.id}">Test drive</button><button class="btn ghost" data-close>Close</button></div></div></div>`;
  $("#detail").showModal(); calc();
}
function showCompare() {
  const l = cmp.map(id => cars.find(c => c.id === id));
  const rows = [["Price", c => money(c.price)], ["Type", c => c.type], ["Power", c => c.hp + " hp"], ["0-100 km/h", c => c.accel + " s"], ["Range", c => c.rangeKm + " km"], ["Seats", c => c.seats]];
  $("#cmpdlg").innerHTML = `<h3>Compare</h3><div class="scroll"><table><tr><th></th>${l.map(c => `<th>${c.name}</th>`).join("")}</tr>${rows.map(([n, f]) => `<tr><td>${n}</td>${l.map(c => `<td>${f(c)}</td>`).join("")}</tr>`).join("")}</table></div><div class="row"><button class="btn ghost" data-close>Close</button></div>`;
  $("#cmpdlg").showModal();
}
async function slots() {
  const carId = $("#carSel").value, date = $("#date").value; if (!carId || !date) return;
  const { times, taken } = await api(`/api/slots?carId=${carId}&date=${date}`);
  $("#time").innerHTML = times.map(t => `<option ${taken.includes(t) ? "disabled" : ""}>${t}${taken.includes(t) ? " (taken)" : ""}</option>`).join("");
}
function openDrive(id) {
  $("#detail").close(); $("#carSel").innerHTML = cars.map(c => `<option value="${c.id}" ${c.id === id ? "selected" : ""}>${c.name}</option>`).join("");
  const today = new Date().toISOString().split("T")[0]; $("#date").min = today; $("#date").value = today; $("#msg").textContent = ""; $("#dlg").showModal(); slots();
}

document.addEventListener("click", async e => {
  const t = e.target, d = t.dataset;
  if (d.t) { st.type = d.t; render(); }
  if (d.brand) { st.brand = d.brand; render(); }
  if (d.view) showDetail(d.view);
  if (d.save) { saved = saved.includes(d.save) ? saved.filter(x => x !== d.save) : [...saved, d.save]; persist(); render(); }
  if (t.hasAttribute("data-drive")) { e.preventDefault(); openDrive(d.drive); }
  if (t.hasAttribute("data-close")) t.closest("dialog").close();
  if (d.col) { ci = +d.col; const c = cur.colors[ci]; $("#detail .big svg").outerHTML = svg(c.h, cur.body); $("#cn").textContent = c.n; document.querySelectorAll(".sw button").forEach((b, i) => b.classList.toggle("on", i === ci)); }
  if (t.id === "cmpgo") showCompare();
  if (t.id === "cmpx") { cmp = []; render(); }
  if (t.id === "pre") {
    t.disabled = true; t.textContent = "Opening checkout...";
    try { location.href = (await api("/api/checkout", { id: cur.id, color: cur.colors[ci].n })).url; }
    catch (err) { toast(err.error || "Payment could not start."); t.disabled = false; t.textContent = "Pre-order for $500"; }
  }
});
document.addEventListener("input", e => {
  if (["dn", "tm", "ap"].includes(e.target.id)) calc();
  if (e.target.id === "q") { st.q = e.target.value; render(); }
  if (e.target.id === "sort") { st.sort = e.target.value; render(); }
  if (e.target.id === "carSel" || e.target.id === "date") slots();
  if (e.target.dataset.cmp) { const id = e.target.dataset.cmp; if (e.target.checked && cmp.length >= 3) { e.target.checked = false; return toast("Compare up to 3 cars."); } cmp = e.target.checked ? [...cmp, id] : cmp.filter(x => x !== id); render(); }
});
$("#form").onsubmit = async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); f.time = f.time.replace(" (taken)", "");
  try { const d = await api("/api/testdrive", f); $("#dlg").close(); e.target.reset(); toast(`Booked! Your reference is ${d.ref}.`); }
  catch (err) { $("#msg").textContent = (err.errors || ["Something went wrong."]).join(" "); slots(); }
};

api("/api/cars").then(d => { cars = d; render(); $("#heroCar").innerHTML = svg("#f5a524", "sports"); });
const qp = new URLSearchParams(location.search);
if (qp.get("session_id")) api("/api/verify?session_id=" + qp.get("session_id")).then(o => { toast(`Deposit received. Pre-order ${o.ref} confirmed.`); history.replaceState({}, "", "/"); }).catch(() => toast("We could not verify your payment yet."));
if (qp.get("paid") === "0") toast("Payment cancelled. You were not charged.");
