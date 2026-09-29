/* =========================================================
   CART — stored in localStorage; rendered into the drawer,
   the cart page and the checkout summary.
   ========================================================= */
window.Cart = (() => {
  const KEY = "ns_cart_v1";
  const COUPON_KEY = "ns_coupon_v1";
  const money = n => new Intl.NumberFormat(SITE.locale, { style: "currency", currency: SITE.currency }).format(n);

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function write(items) { localStorage.setItem(KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent("cart:change")); }
  function getCoupon() { return localStorage.getItem(COUPON_KEY) || ""; }
  function setCoupon(c) { if (c) localStorage.setItem(COUPON_KEY, c.toUpperCase()); else localStorage.removeItem(COUPON_KEY); document.dispatchEvent(new CustomEvent("cart:change")); }

  function lines() {
    return read().map(i => {
      const product = PRODUCTS.find(p => p.id === i.id);
      const variant = product && product.variants.find(v => v.sku === i.sku);
      return product && variant ? { product, variant, qty: i.qty } : null;
    }).filter(Boolean);
  }
  function count() { return read().reduce((s, i) => s + i.qty, 0); }

  function add(id, sku, qty = 1) {
    const items = read();
    const product = PRODUCTS.find(p => p.id === id);
    const variant = product && product.variants.find(v => v.sku === sku);
    if (!variant) return false;
    const ex = items.find(i => i.sku === sku);
    const newQty = (ex ? ex.qty : 0) + qty;
    if (variant.stock !== undefined && newQty > variant.stock) {
      UI.toast(`Only ${variant.stock} of that item in stock.`, "warning");
      return false;
    }
    if (ex) ex.qty = newQty; else items.push({ id, sku, qty });
    write(items);
    return true;
  }
  function setQty(sku, qty) {
    let items = read();
    const it = items.find(i => i.sku === sku);
    if (!it) return;
    if (qty <= 0) items = items.filter(i => i.sku !== sku); else it.qty = qty;
    write(items);
  }
  function remove(sku) { write(read().filter(i => i.sku !== sku)); }
  function clear() { write([]); setCoupon(""); }

  // methodId = the chosen payment method (see SITE.payment.methods)
  function payMethod(id) {
    const list = (SITE.payment && SITE.payment.methods) || [];
    return list.find(m => m.id === id) || null;
  }
  function totals(shippingId, methodId) {
    const ls = lines();
    const subtotal = ls.reduce((s, l) => s + l.variant.price * l.qty, 0);
    let discount = 0, coupon = null, couponError = "", freeShip = false;
    const code = getCoupon();
    if (code) {
      const r = Discounts.evaluate(code, ls);
      if (r.ok) { discount = r.discount; coupon = r.code; freeShip = r.freeShipping; }
      else { couponError = r.reason; }
    }
    // Payment-method discount (e.g. 20% off for paying in Bitcoin)
    const method = payMethod(methodId);
    let payDiscount = 0;
    const blockedByCode = coupon && SITE.payment && SITE.payment.stackDiscounts === false;
    if (method && method.discount && !blockedByCode) {
      payDiscount = Math.round(Math.max(0, subtotal - discount) * (method.discount / 100) * 100) / 100;
    }
    const afterDiscount = Math.max(0, subtotal - discount - payDiscount);
    const opt = SITE.shipping.options.find(o => o.id === shippingId) || SITE.shipping.options[0];
    let shipping = opt.price;
    if (ls.length === 0) shipping = 0;
    else if (freeShip && opt.id === "standard") shipping = 0;
    else if (afterDiscount >= SITE.shipping.freeThreshold && opt.id === "standard") shipping = 0;
    const total = afterDiscount + shipping;
    return { lines: ls, subtotal, discount, coupon, couponError, payDiscount, method, blockedByCode,
             shipping, shippingOption: opt, total, toFree: Math.max(0, SITE.shipping.freeThreshold - afterDiscount) };
  }

  /* ---------- Rendering ---------- */
  // Product artwork. Uses the photo at product.image when there is one and
  // falls back to images/products/placeholder.jpg if that file is missing,
  // then to the generated tile for products with no image at all.
  const FALLBACK = "images/products/placeholder.jpg";
  function tile(product, size = "", variant = null) {
    const src = (variant && variant.image) || product.image;
    if (src) {
      return `<div class="tile tile--photo ${size}"><img src="${src}" alt="${product.name || ""}" loading="lazy" decoding="async"
        onerror="this.onerror=null;this.src='${FALLBACK}'"></div>`;
    }
    return `<div class="tile tile--${product.form} ${size}" style="--tint:${product.tint}"><div class="tile__accent"></div><div class="tile__jar" data-label="${product.name}"></div></div>`;
  }

  const trash = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  function lineHTML(l, editable = true) {
    const opts = Object.values(l.variant.options).join(" · ");
    return `
      <div class="line" data-sku="${l.variant.sku}">
        <div class="line__media">${tile(l.product, "", l.variant)}</div>
        <div class="line__info">
          <div class="line__title"><a href="product.html?id=${l.product.id}">${l.product.name}</a></div>
          <div class="line__variant">${opts}</div>
          <div class="line__unit">${money(l.variant.price)}</div>
          ${editable ? `
          <div class="line__controls">
            <div class="qty qty--pill" aria-label="Quantity for ${l.product.name}">
              <button type="button" data-dec aria-label="Decrease quantity">−</button>
              <input type="number" min="1" value="${l.qty}" aria-label="Quantity">
              <button type="button" data-inc aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="line__remove" data-remove aria-label="Remove ${l.product.name}">${trash}</button>
          </div>` : `<div class="line__variant">Qty ${l.qty}</div>`}
        </div>
        <div class="line__price">${money(l.variant.price * l.qty)}</div>
      </div>`;
  }
  function totalsHTML(t) {
    return `
      <div class="totals">
        <div><span>${t.lines.reduce((n, l) => n + l.qty, 0)} item${t.lines.reduce((n, l) => n + l.qty, 0) === 1 ? "" : "s"}</span><span>${money(t.subtotal)}</span></div>
        ${t.discount > 0 ? `<div class="discount"><span>Discount (${t.coupon.code})</span><span>−${money(t.discount)}</span></div>` : ""}
        ${t.payDiscount > 0 ? `<div class="discount"><span>${t.method.label} (${t.method.discount}% off)</span><span>−${money(t.payDiscount)}</span></div>` : ""}
        <div><span>Delivery${t.shippingOption ? ` · ${t.shippingOption.label}` : ""}</span><span>${t.shipping === 0 ? "Free" : money(t.shipping)}</span></div>
        <div class="grand"><span>Total <small>(inc. VAT)</small></span><span>${money(t.total)}</span></div>
      </div>`;
  }
  let uidN = 0;
  function couponHTML(t) {
    const uid = "coupon-" + (++uidN);
    if (t.coupon) {
      return `<div class="applied">${t.coupon.code} — ${t.coupon.description} <button type="button" data-remove-coupon aria-label="Remove code">×</button></div>`;
    }
    return `
      <form class="coupon" data-coupon-form>
        <label class="visually-hidden" for="${uid}">Discount code</label>
        <input id="${uid}" type="text" name="code" placeholder="Discount code" autocomplete="off" autocapitalize="characters" value="${getCoupon()}">
        <button type="submit">Apply</button>
      </form>
      ${t.couponError ? `<div class="coupon__msg err">${t.couponError}</div>` : ""}`;
  }
  const truck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>';
  // Free-delivery banner (BioLab-style). compact = drawer version.
  function progressHTML(t, compact = false) {
    if (!t.lines.length) return "";
    const done = t.toFree <= 0 || (t.coupon && t.coupon.type === "shipping");
    const pct = done ? 100 : Math.min(100, ((SITE.shipping.freeThreshold - t.toFree) / SITE.shipping.freeThreshold) * 100);
    const msg = done ? `You've unlocked <strong>free UK delivery</strong>` : `You're <strong>${money(t.toFree)}</strong> away from <strong>free delivery</strong>`;
    return `
      <div class="ship-banner ${compact ? "ship-banner--compact" : ""} ${done ? "is-done" : ""}" role="status">
        <div class="ship-banner__top">${truck}<p>${msg}</p></div>
        <div class="ship-banner__track" aria-hidden="true"><div class="ship-banner__fill" style="width:${Math.max(pct, 8)}%"><span>${done ? "Free" : money(SITE.shipping.freeThreshold - t.toFree)}</span></div><i>${truck}</i></div>
        ${compact ? "" : `<a class="ship-banner__link" href="shop.html">‹ Continue shopping</a>`}
      </div>`;
  }
  // "Spend £X more to unlock CODE" — only for codes marked nudge:true
  function nudgeHTML(t) {
    if (!t.lines.length || t.coupon) return "";
    const n = (window.DISCOUNTS || []).filter(d => d.nudge && d.minSpend > t.subtotal && (!d.expires || new Date(d.expires) > new Date()))
      .sort((a, b) => a.minSpend - b.minSpend)[0];
    if (!n) return "";
    return `<div class="nudge">Add <strong>${money(n.minSpend - t.subtotal)}</strong> more and use <strong>${n.code}</strong> for ${n.description.charAt(0).toLowerCase() + n.description.slice(1)}.</div>`;
  }
  // "Goes well with" suggestions — products not already in the basket
  function upsellHTML(t, max = 3) {
    if (!t.lines.length) return "";
    const inCart = new Set(t.lines.map(l => l.product.id));
    const picks = PRODUCTS.filter(p => !inCart.has(p.id) && p.variants.some(v => v.stock > 0)).slice(0, max);
    if (!picks.length) return "";
    return `<div class="upsell"><h4>Goes well with</h4>${picks.map(p => {
      const avail = p.variants.filter(v => v.stock > 0);
      const choose = avail.length > 1 ? `<select aria-label="Choose option for ${p.name}" data-upsell-variant>${avail.map(v => `<option value="${v.sku}">${Object.values(v.options).join(" · ")} — ${money(v.price)}</option>`).join("")}</select>` : `<span class="upsell__price">${money(avail[0].price)}</span>`;
      return `<div class="upsell__item" data-upsell="${p.id}" data-sku="${avail[0].sku}"><div class="upsell__tile">${tile(p)}</div><div class="upsell__body"><a href="product.html?id=${p.id}">${p.name}</a>${choose}<button type="button" class="btn btn--outline btn--sm" data-upsell-add>Add</button></div></div>`;
    }).join("")}</div>`;
  }

  function bind(root) {
    root.addEventListener("click", e => {
      const line = e.target.closest(".line"); const sku = line && line.dataset.sku;
      if (e.target.matches("[data-inc]")) setQty(sku, qtyOf(line) + 1);
      if (e.target.matches("[data-dec]")) setQty(sku, qtyOf(line) - 1);
      if (e.target.closest("[data-upsell-add]")) {
        const it = e.target.closest("[data-upsell]"); const selEl = it.querySelector("[data-upsell-variant]");
        if (add(it.dataset.upsell, selEl ? selEl.value : it.dataset.sku, 1)) UI.toast("Added to basket", "success");
      }
      if (e.target.closest("[data-remove]")) { remove(sku); UI.toast("Removed from basket", "info"); return; }
      if (e.target.matches("[data-remove-coupon]")) { setCoupon(""); UI.toast("Discount code removed", "info"); }
    });
    root.addEventListener("change", e => {
      const line = e.target.closest(".line");
      if (line && e.target.matches("input[type=number]")) setQty(line.dataset.sku, Math.max(0, parseInt(e.target.value || "0", 10)));
    });
    root.addEventListener("submit", e => {
      const f = e.target.closest("[data-coupon-form]");
      if (!f) return;
      e.preventDefault();
      const code = f.code.value.trim();
      const r = Discounts.evaluate(code, lines());
      if (r.ok) { setCoupon(code); UI.toast(`${code.toUpperCase()} applied — ${r.code.description}`, "success"); }
      else { setCoupon(""); UI.toast(r.reason, "error"); f.code.value = code; f.code.focus(); }
    });
  }
  function qtyOf(line) { return parseInt(line.querySelector("input[type=number]").value, 10) || 1; }

  return { money, lines, count, add, setQty, remove, clear, totals, getCoupon, setCoupon, payMethod, tile, lineHTML, totalsHTML, couponHTML, progressHTML, nudgeHTML, upsellHTML, bind };
})();
