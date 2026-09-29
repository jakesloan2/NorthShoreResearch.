/* =========================================================
   DISCOUNT CODES
   Each code:
     code        — what the customer types (case-insensitive)
     type        — "percent" | "fixed" | "shipping"
     value       — 10 (=10%) for percent, 5 (=£5) for fixed, ignored for shipping
     minSpend    — optional minimum subtotal (before discount)
     categories  — optional: only applies to items in these categories
     products    — optional: only applies to these product ids
     maxUses     — optional (enforced by your payment backend, shown here for reference)
     expires     — optional ISO date "2026-12-31"
     nudge       — optional: true shows "spend £X more to use CODE" in the basket
     oncePerCustomer — optional: true means one use per customer.
                   READ THE WARNING BELOW — this cannot be enforced here.
     description — shown to the customer when applied
   Codes are validated client-side for the cart display AND must be
   re-validated server-side (Stripe/Shopify) before payment is taken.
   ========================================================= */
window.DISCOUNTS = [
  { code: "WELCOME10", type: "percent",  value: 10, oncePerCustomer: true, description: "10% off your first order" },
  { code: "MEMBER15", type: "percent",  value: 15, description: "15% member discount" },
  { code: "PROTEIN5",  type: "fixed",    value: 5,  minSpend: 25, categories: ["Protein"], description: "£5 off protein orders over £25" },
  { code: "FREESHIP",  type: "shipping", value: 0,  minSpend: 30, description: "Free standard delivery over £30" },
  { code: "BUNDLE20",  type: "percent",  value: 20, minSpend: 75, nudge: true, description: "20% off orders over £75" }
];

/* ---------------------------------------------------------
   ONE USE PER CUSTOMER — WHERE IT'S ACTUALLY ENFORCED

   This file runs in the customer's browser, so nothing here can
   stop a code being reused. Clearing site data, opening a private
   window or using another device resets anything we remember.

   What the code below does: once someone has ordered with a
   "oncePerCustomer" code, we remember it on that device and stop
   offering it again. That's a courtesy, not a control.

   The real limit has to be set where the money is taken:

   • SHOPIFY — Discounts → your code → Usage limits →
     "Limit to one use per customer". Shopify checks it against the
     customer account or email at checkout and rejects reuse.

   • YOUR OWN BACKEND (Fena / crypto) — before charging, look the
     code up against a record of who has already used it and refuse
     it if it's been used. The browser's total is never trusted.

   Until one of those is in place, treat every code as reusable.
   --------------------------------------------------------- */
window.Discounts = {
  find(code) {
    if (!code) return null;
    const c = String(code).trim().toUpperCase();
    return window.DISCOUNTS.find(d => d.code === c) || null;
  },
  /**
   * Evaluate a code against cart lines.
   * lines: [{ product, variant, qty }]
   * returns { ok, reason, discount, freeShipping, code }
   */
  /* Codes this device has already ordered with. Convenience only —
     see the warning above. */
  USED_KEY: "ns_used_codes_v1",
  usedCodes() {
    try { return JSON.parse(localStorage.getItem(this.USED_KEY)) || []; } catch { return []; }
  },
  markUsed(code) {
    if (!code) return;
    const d = this.find(code);
    if (!d || !d.oncePerCustomer) return;
    try {
      const list = this.usedCodes();
      if (!list.includes(d.code)) { list.push(d.code); localStorage.setItem(this.USED_KEY, JSON.stringify(list)); }
    } catch {}
  },

  evaluate(code, lines) {
    const d = this.find(code);
    if (!d) return { ok: false, reason: "That code isn't valid." };
    if (d.oncePerCustomer && this.usedCodes().includes(d.code)) {
      return { ok: false, reason: `${d.code} has already been used on this account.` };
    }
    if (d.expires && new Date(d.expires) < new Date()) return { ok: false, reason: "That code has expired." };
    const subtotal = lines.reduce((s, l) => s + l.variant.price * l.qty, 0);
    if (d.minSpend && subtotal < d.minSpend) {
      return { ok: false, reason: `Spend £${d.minSpend.toFixed(2)} or more to use ${d.code}.` };
    }
    let eligible = lines;
    if (d.categories) eligible = eligible.filter(l => d.categories.includes(l.product.category));
    if (d.products)   eligible = eligible.filter(l => d.products.includes(l.product.id));
    const eligibleTotal = eligible.reduce((s, l) => s + l.variant.price * l.qty, 0);

    if (d.type === "shipping") return { ok: true, discount: 0, freeShipping: true, code: d };
    if (eligibleTotal <= 0) return { ok: false, reason: "That code doesn't apply to anything in your basket." };

    let discount = 0;
    if (d.type === "percent") discount = eligibleTotal * (d.value / 100);
    if (d.type === "fixed")   discount = Math.min(d.value, eligibleTotal);
    return { ok: true, discount: Math.round(discount * 100) / 100, freeShipping: false, code: d };
  }
};
