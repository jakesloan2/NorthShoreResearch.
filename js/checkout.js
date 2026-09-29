/* =========================================================
   CHECKOUT — one page, in the order the customer fills it in:
   contact → delivery method → address → payment.
   Payment itself happens on the provider's secure page (Shopify
   or Stripe). Card details are never entered on this site.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("checkout");
  const summary = document.getElementById("summary");
  const METHODS = (SITE.payment && SITE.payment.methods) || [];
  const defaultMethod = (METHODS.find(m => m.default) || METHODS[0] || {}).id || "";
  const BT = SITE.buyerTypes && SITE.buyerTypes.options && SITE.buyerTypes.options.length ? SITE.buyerTypes : null;
  const order = { customer: {}, address: {}, shipping: SITE.shipping.options[0].id, notes: "",
                  payment: defaultMethod, paymentChoice: "", buyerType: "", business: "",
                  showCompany: false, showLine2: false };
  try { Object.assign(order, JSON.parse(sessionStorage.getItem("ns_checkout") || "{}")); } catch {}

  if (!Cart.lines().length) {
    root.innerHTML = `<div class="panel empty"><p>Your basket is empty.</p><a class="btn btn--primary" href="shop.html">Start shopping</a></div>`;
    summary.innerHTML = ""; return;
  }

  const esc = v => String(v ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const field = (name, label, o = {}) => `
    <div class="field ${o.full ? "full" : ""}">
      <label for="f-${name}">${label}${o.optional ? ' <span class="muted">(optional)</span>' : ""}</label>
      ${o.type === "select"
        ? `<select id="f-${name}" name="${name}">${o.options.map(x => `<option ${x === o.value ? "selected" : ""}>${x}</option>`).join("")}</select>`
        : o.type === "textarea"
        ? `<textarea id="f-${name}" name="${name}" rows="3">${esc(o.value)}</textarea>`
        : `<input id="f-${name}" name="${name}" type="${o.type || "text"}" value="${esc(o.value)}" autocomplete="${o.ac || "on"}" ${o.optional ? "" : "required"} ${o.pattern ? `pattern="${o.pattern}"` : ""} ${o.inputmode ? `inputmode="${o.inputmode}"` : ""}>`}
      <div class="err" id="f-${name}-err">${o.err || "Please complete this field."}</div>
    </div>`;

  const btcIcon = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#fff" d="M22.2 14.2c.3-1.9-1.2-2.9-3.2-3.6l.7-2.6-1.6-.4-.7 2.5c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.6-.4-.7 2.6-1-.3-2.2-.6-.4 1.7s1.2.3 1.2.3c.6.2.8.6.7 1l-.8 3.1v.1l-1.1 4.4c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.8 2.1.5 1.1.3-.7 2.7 1.6.4.7-2.6c.4.1.9.2 1.3.3l-.7 2.6 1.6.4.7-2.7c2.7.5 4.8.3 5.6-2.2.7-2-.03-3.1-1.5-3.9 1.06-.24 1.86-.94 2.08-2.4zm-3.7 5.2c-.5 2-3.8.9-4.9.6l.9-3.6c1.1.3 4.5.8 4 3zm.5-5.3c-.4 1.8-3.2.9-4.1.7l.8-3.2c.9.2 3.8.6 3.3 2.5z"/></svg>';

  function render() {
    const c = order.customer, a = order.address;
    const isBusiness = BT && (BT.businessOptions || []).includes(order.buyerType);
    const t = Cart.totals(order.shipping, order.payment);
    root.innerHTML = `
      <button type="button" class="summary-toggle" aria-expanded="false" aria-controls="summary" data-summary-toggle>
        ${UI.icons.cart}<span>Show order summary</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><strong>${Cart.money(t.total)}</strong>
      </button>

      <form id="co-form" novalidate>
        <section class="co-section" aria-labelledby="co-contact">
          <div class="co-section__head"><h2 id="co-contact"><span class="co-num">1</span>Contact</h2><a href="account.html" class="co-link">Have an account? Log in</a></div>
          <div class="form-grid">
            ${field("email", "Email address", { type: "email", ac: "email", value: c.email, err: "Enter an email address like name@example.com.", full: true })}
            <label class="check full"><input type="checkbox" name="marketing" id="f-marketing" ${c.marketing ? "checked" : ""}><span>Email me new products and member offers (optional — unsubscribe any time)</span></label>
          </div>
        </section>

        <section class="co-section" aria-labelledby="co-method">
          <div class="co-section__head"><h2 id="co-method"><span class="co-num">2</span>Delivery method</h2></div>
          ${SITE.shipping.options.map(o => {
            const free = o.id === "standard" && (t.subtotal - t.discount >= SITE.shipping.freeThreshold || (t.coupon && t.coupon.type === "shipping"));
            const note = o.note;
            return `<label class="ship-opt"><input type="radio" name="shipping" value="${o.id}" ${order.shipping === o.id ? "checked" : ""}><div><strong>${o.label}</strong><span>${o.eta}${note ? " · " + note : ""}</span></div><span class="price">${o.price === 0 || free ? "Free" : Cart.money(o.price)}</span></label>`;
          }).join("")}
        </section>

        <section class="co-section" aria-labelledby="co-address">
          <div class="co-section__head"><h2 id="co-address"><span class="co-num">3</span>Delivery address</h2></div>
          <div class="form-grid">
            ${field("first", "First name", { ac: "given-name", value: c.first })}
            ${field("last", "Last name", { ac: "family-name", value: c.last })}
            ${order.showCompany ? field("company", "Company", { ac: "organization", value: a.company, optional: true, full: true }) : `<button type="button" class="add-field full" data-reveal="showCompany">＋ Add company (optional)</button>`}
            ${field("line1", "Street address", { ac: "address-line1", value: a.line1, full: true })}
            ${order.showLine2 ? field("line2", "Flat, suite, etc.", { ac: "address-line2", value: a.line2, optional: true, full: true }) : `<button type="button" class="add-field full" data-reveal="showLine2">＋ Add address line 2 (optional)</button>`}
            ${field("city", "Town / city", { ac: "address-level2", value: a.city })}
            ${field("postcode", "Postcode", { ac: "postal-code", value: a.postcode, err: "Enter a UK postcode like BT1 5GS.", pattern: "^[A-Za-z]{1,2}\\d[A-Za-z\\d]?\\s*\\d[A-Za-z]{2}$" })}
            ${field("country", "Country / region", { type: "select", options: ["United Kingdom"], value: "United Kingdom", full: true })}
            ${field("phone", "Phone for delivery updates", { type: "tel", ac: "tel", inputmode: "tel", value: c.phone, optional: true, full: true })}
            ${field("notes", "Delivery instructions", { type: "textarea", value: order.notes, optional: true, full: true })}
          </div>
        </section>

        <section class="co-section" aria-labelledby="co-pay">
          <div class="co-section__head"><h2 id="co-pay"><span class="co-num">4</span>Payment Options</h2></div>
          <p class="secure">${UI.icons.shield}<span>All transactions are secure and encrypted.</span></p>

          <div class="pay-methods" role="radiogroup" aria-label="Payment method">
            ${METHODS.map(m => {
              const on = order.payment === m.id;
              return `
              <label class="pay-method ${on ? "is-on" : ""}">
                <span class="pay-method__top">
                  <input type="radio" name="payment" value="${m.id}" ${on ? "checked" : ""}>
                  <span class="pay-method__name">${m.label}${m.offer ? ` <span class="pay-method__offer">— ${m.offer}</span>` : ""}</span>
                  ${m.icon === "bitcoin" ? `<span class="pay-method__icon pay-method__icon--btc" aria-hidden="true">${btcIcon}</span>` : ""}
                </span>
                ${m.blurb ? `<span class="pay-method__blurb">${m.blurb}</span>` : ""}
                ${on && m.choices && m.choices.length ? `
                <span class="pay-method__choices">
                  ${m.choices.map((c, i) => `
                    <label class="pay-choice">
                      <input type="radio" name="paymentChoice" value="${esc(c)}" ${(order.paymentChoice || m.choices[0]) === c ? "checked" : ""}>
                      <span>${c}</span>
                    </label>`).join("")}
                </span>` : ""}
              </label>`;
            }).join("")}
          </div>

          ${t.blockedByCode && t.method && t.method.discount ? `<p class="note pay-note">The ${t.method.discount}% ${t.method.label} discount can't be combined with a discount code. Remove the code to use it.</p>` : ""}

          <div class="pay-marks" aria-hidden="true"><span>Visa</span><span>Mastercard</span><span>Amex</span><span>Apple Pay</span><span>Google Pay</span><span>Pay by Bank</span><span>Bitcoin</span></div>

          ${BT ? `
          <div class="buyer">
            <h3 class="buyer__head">${BT.heading || "About you"}</h3>
            <div class="field">
              <label for="f-buyerType">${BT.label || "Are you buying as"}</label>
              <select id="f-buyerType" name="buyerType" ${BT.required === false ? "" : "required"}>
                <option value="">Please choose…</option>
                ${BT.options.map(o => `<option ${order.buyerType === o ? "selected" : ""}>${esc(o)}</option>`).join("")}
              </select>
              <div class="err" id="f-buyerType-err">Please choose one of the options.</div>
            </div>
            ${isBusiness ? `
              ${field("business", "Business name", { ac: "organization", value: order.business, optional: true, full: true })}
              ${BT.note ? `<p class="note">${BT.note}</p>` : ""}` : ""}
          </div>` : ""}

          <label class="check mt-3"><input type="checkbox" name="terms" id="f-terms" required><span>I have read and agree to the <a href="terms.html" target="_blank" rel="noopener"><u>terms and conditions</u></a> and <a href="privacy.html" target="_blank" rel="noopener"><u>privacy policy</u></a>.</span></label>
          <div class="err terms-err" id="f-terms-err">Please accept the terms and conditions to continue.</div>
          <button class="btn btn--accent btn--block btn--lg btn--pill mt-3" type="submit" id="pay">Complete order · ${Cart.money(t.total)}</button>
          <p class="note text-center mt-2"><a href="cart.html"><u>‹ Return to basket</u></a></p>
        </section>
      </form>`;
    renderSummary(t);
  }

  function renderSummary(t) {
    summary.innerHTML = `<div class="panel order-summary summary">
      <h3>Order summary</h3>
      ${t.lines.map(l => Cart.lineHTML(l, false)).join("")}
      <div class="mt-2">${Cart.couponHTML(t)}</div>
      ${Cart.totalsHTML(t)}
    </div>`;
    const tg = root.querySelector("[data-summary-toggle] strong"); if (tg) tg.textContent = Cart.money(t.total);
    const pb = document.getElementById("pay"); if (pb && !pb.disabled) pb.textContent = `Complete order · ${Cart.money(t.total)}`;
  }

  function collect() {
    const f = document.getElementById("co-form"); if (!f) return;
    const val = n => f.querySelector(`[name=${n}]`)?.value.trim() ?? undefined;
    const keep = (n, old) => { const v = val(n); return v === undefined ? old : v; };
    order.customer = { email: keep("email", order.customer.email), first: keep("first", order.customer.first), last: keep("last", order.customer.last), phone: keep("phone", order.customer.phone), marketing: f.marketing.checked };
    const a = order.address;
    order.address = { company: keep("company", a.company), line1: keep("line1", a.line1), line2: keep("line2", a.line2), city: keep("city", a.city), postcode: (keep("postcode", a.postcode) || "").toUpperCase(), country: "United Kingdom" };
    order.notes = keep("notes", order.notes);
    order.buyerType = keep("buyerType", order.buyerType);
    order.business = keep("business", order.business);
    try { sessionStorage.setItem("ns_checkout", JSON.stringify(order)); } catch {}
  }

  function validate() {
    const f = document.getElementById("co-form"); let first = null;
    f.querySelectorAll(".field").forEach(fd => {
      const i = fd.querySelector("input, select, textarea"); const v = i.value.trim();
      const bad = i.required && (!v || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) || (i.pattern && !new RegExp(i.pattern).test(v)));
      fd.classList.toggle("is-invalid", !!bad);
      i.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) { i.setAttribute("aria-describedby", i.id + "-err"); first = first || i; } else i.removeAttribute("aria-describedby");
    });
    const terms = f.terms; const termsBad = !terms.checked;
    root.querySelector(".terms-err").classList.toggle("show", termsBad);
    if (termsBad) first = first || terms;
    if (first) { first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); }
    return !first;
  }

  root.addEventListener("click", e => {
    const rv = e.target.closest("[data-reveal]");
    if (rv) { collect(); order[rv.dataset.reveal] = true; render(); const n = rv.dataset.reveal === "showCompany" ? "company" : "line2"; document.getElementById("f-" + n)?.focus(); return; }
    const tg = e.target.closest("[data-summary-toggle]");
    if (tg) {
      const open = tg.getAttribute("aria-expanded") === "true";
      tg.setAttribute("aria-expanded", String(!open)); tg.querySelector("span").textContent = open ? "Show order summary" : "Hide order summary";
      summary.classList.toggle("is-open", !open);
    }
  });
  root.addEventListener("change", e => {
    if (e.target.name === "shipping") { collect(); order.shipping = e.target.value; const y = scrollY; render(); scrollTo(0, y); }
    else if (e.target.name === "payment") { collect(); order.payment = e.target.value; order.paymentChoice = ""; const y = scrollY; render(); scrollTo(0, y); }
    else if (e.target.name === "paymentChoice") { order.paymentChoice = e.target.value; try { sessionStorage.setItem("ns_checkout", JSON.stringify(order)); } catch {} }
    else if (e.target.name === "buyerType") { collect(); order.buyerType = e.target.value; const y = scrollY; render(); scrollTo(0, y); document.getElementById("f-buyerType").focus(); }
    else if (e.target.name === "terms" && e.target.checked) root.querySelector(".terms-err").classList.remove("show");
  });
  root.addEventListener("focusout", e => { if (e.target.closest("#co-form")) collect(); });
  root.addEventListener("submit", e => { e.preventDefault(); collect(); if (validate()) pay(); });
  Cart.bind(summary);
  // A discount code can switch a payment discount on or off, so rebuild the
  // whole step rather than just the summary. collect() keeps what's typed.
  document.addEventListener("cart:change", () => {
    if (!Cart.lines().length) { location.href = "cart.html"; return; }
    collect(); const y = scrollY; render(); scrollTo(0, y);
  });

  async function pay() {
    const t = Cart.totals(order.shipping, order.payment);
    const payload = {
      items: t.lines.map(l => ({ sku: l.variant.sku, name: l.product.name, options: l.variant.options, qty: l.qty, unitPrice: l.variant.price, shopifyVariantId: l.variant.shopifyVariantId || null })),
      coupon: t.coupon ? t.coupon.code : null, shipping: order.shipping, customer: order.customer,
      buyerType: order.buyerType, business: order.business || "",
      payment: order.payment, paymentChoice: order.paymentChoice || ((t.method && t.method.choices) ? t.method.choices[0] : ""),
      address: order.address, notes: order.notes,
      clientTotals: { subtotal: t.subtotal, discount: t.discount, payDiscount: t.payDiscount, shipping: t.shipping, total: t.total } // the server/provider MUST recompute
    };
    const btn = document.getElementById("pay"); btn.disabled = true; btn.textContent = "Taking you to secure payment…";
    try {
      if (SITE.payment.mode === "shopify") {
        const missing = payload.items.filter(i => !i.shopifyVariantId);
        if (missing.length) throw new Error(`Missing shopifyVariantId for: ${missing.map(i => i.sku).join(", ")}`);
        const parts = payload.items.map(i => `${i.shopifyVariantId}:${i.qty}`).join(",");
        const q = new URLSearchParams();
        if (payload.coupon) q.set("discount", payload.coupon);
        q.set("checkout[email]", order.customer.email);
        const A = order.address;
        [["first_name", order.customer.first], ["last_name", order.customer.last], ["company", A.company || order.business], ["address1", A.line1], ["address2", A.line2],
         ["city", A.city], ["zip", A.postcode], ["country", "GB"], ["phone", order.customer.phone]].forEach(([k, v]) => v && q.set(`checkout[shipping_address][${k}]`, v));
        if (payload.coupon) Discounts.markUsed(payload.coupon);
        location.href = `https://${SITE.payment.shopifyDomain}/cart/${parts}?${q}`; return;
      }
      if (SITE.payment.mode === "stripe") {
        const r = await fetch(SITE.payment.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const j = await r.json(); if (!j.url) throw new Error(j.error || "No checkout URL returned");
        if (payload.coupon) Discounts.markUsed(payload.coupon);
        location.href = j.url; return;
      }
      // demo mode — no payment taken
      const ref = "NS-" + Date.now().toString(36).toUpperCase().slice(-6);
      sessionStorage.setItem("ns_last_order", JSON.stringify({ ref, ...payload, totals: payload.clientTotals, placedAt: new Date().toISOString(), shippingLabel: t.shippingOption.label, eta: t.shippingOption.eta, buyerType: order.buyerType, business: order.business,
        methodLabel: t.method ? t.method.label : "", methodIcon: t.method ? t.method.icon : "" }));
      if (payload.coupon) Discounts.markUsed(payload.coupon);
      Cart.clear(); sessionStorage.removeItem("ns_checkout");
      location.href = "confirmation.html";
    } catch (err) {
      btn.disabled = false; btn.textContent = `Complete order · ${Cart.money(t.total)}`;
      UI.toast("We couldn't start the payment. Please try again, or contact us if it keeps happening.", "error", 5000);
      console.error(err);
    }
  }
  render();
});
