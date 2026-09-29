/* =========================================================
   MAIN — shared header/footer, drawers, toasts, helpers
   ========================================================= */
window.UI = (() => {
  const icons = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 8h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.7 5.8 21.2l1.4-7L2 9.4l7-.8z"/></svg>',
    return: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20c0-9 5-14 14-15-1 9-6 14-14 15z"/><path d="M5 20c3-5 6-8 10-11"/></svg>'
  };
  const logoMark = `<img class="logo__mark" src="images/logo-mark.png" alt="" width="256" height="237">`;
  const logoFull = `${logoMark}<img class="logo__word" src="images/logo-wordmark.png" alt="${SITE.name} ${SITE.tagline}" width="900" height="145">`;

  /* One list drives both the desktop nav and the burger menu.
     Edit here to add, remove or reorder links site-wide. */
  const NAV = [
    { href: "shop.html",     label: "Products" },
    { href: "coa.html",      label: "COA Library" },
    { href: "about.html",    label: "About us" },
    { href: "contact.html",  label: "Contact us" },
    { href: "faq.html",      label: "FAQ" },
    { href: "shipping.html", label: "Delivery" }
  ];

  function page() { return location.pathname.split("/").pop() || "index.html"; }

  function header() {
    const cur = page();
    const links = NAV.map(n => `<a href="${n.href}" ${n.href.split("?")[0] === cur && !n.href.includes("?") ? 'aria-current="page"' : ""}>${n.label}</a>`).join("");
    return `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="announce">${SITE.announce}</div>
      <header class="header">
        <div class="container header__inner">
          <button class="icon-btn burger" type="button" aria-label="Open menu" data-open="menu">${icons.menu}</button>
          <a class="logo" href="index.html" aria-label="${SITE.name} ${SITE.tagline} home">${logoFull}</a>
          <nav class="nav" aria-label="Primary">${links}</nav>
          <div class="header__actions">
            <form class="search" role="search" action="shop.html">
              ${icons.search}<input type="search" name="q" placeholder="Search products" aria-label="Search products">
            </form>
            <a class="icon-btn" href="shop.html" aria-label="Search" data-search-mobile>${icons.search}</a>
            <a class="icon-btn" href="account.html" aria-label="Account">${icons.user}</a>
            <button class="icon-btn" type="button" aria-label="Open basket" data-open="cart">${icons.cart}<span class="cart-count" data-cart-count data-empty="true">0</span></button>
          </div>
        </div>
      </header>

      <div class="drawer" id="menu-drawer" aria-hidden="true" role="dialog" aria-label="Menu">
        <div class="drawer__backdrop" data-close></div>
        <div class="drawer__panel drawer__panel--left">
          <div class="drawer__head drawer__head--dark"><a class="logo" href="index.html" aria-label="${SITE.name} home">${logoFull}</a><button class="icon-btn" data-close aria-label="Close menu">${icons.close}</button></div>
          <nav class="drawer__nav" aria-label="Mobile">
            ${NAV.map(n => `<a href="${n.href}" ${n.href === cur ? 'aria-current="page"' : ""}>${n.label}</a>`).join("")}
          </nav>
        </div>
      </div>

      <div class="drawer cart-drawer" id="cart-drawer" aria-hidden="true" role="dialog" aria-label="Basket">
        <div class="drawer__backdrop" data-close></div>
        <div class="drawer__panel drawer__panel--right">
          <div class="drawer__head"><h3 class="mb-0">Your basket</h3><button class="icon-btn" data-close aria-label="Close basket">${icons.close}</button></div>
          <div class="cart-lines" data-cart-lines></div>
          <div class="cart-foot" data-cart-foot></div>
        </div>
      </div>
      <div class="toasts" aria-live="polite"></div>`;
  }

  function footer() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div class="footer__brand">
              <a class="logo logo--footer" href="index.html" aria-label="${SITE.name} home">${logoFull}</a>
              <p>${SITE.footerBlurb}</p>
            </div>
            <div><h4>Shop</h4><ul>
              ${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
            </ul></div>
            <div><h4>Help</h4><ul>
              <li><a href="returns.html">Returns & refunds</a></li><li><a href="quality.html">Quality & testing</a></li>
              <li><a href="account.html">My account</a></li>
            </ul></div>
            <div><h4>Company</h4><ul>
              <li><a href="terms.html">Terms & conditions</a></li><li><a href="disclaimer.html">Disclaimer</a></li>
              <li><a href="privacy.html">Privacy policy</a></li><li><a href="cookies.html">Cookie policy</a></li>
              <li><a href="#" data-open-cookie-prefs>Cookie settings</a></li>
            </ul></div>
          </div>
          <div class="footer__bottom">
            <div>© ${new Date().getFullYear()} ${SITE.legalName} · Company no. ${SITE.companyNumber} · ${SITE.address}</div>
            <div class="payments"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>APPLE PAY</span><span>GOOGLE PAY</span></div>
          </div>
          ${SITE.footerNote ? `<p class="note mt-2">${SITE.footerNote}</p>` : ""}
        </div>
                  ${SITE.footerNote ? `<p class="note mt-2">${SITE.footerNote}</p>` : ""}
        </div>
        ${SITE.footerDisclaimer && SITE.footerDisclaimer.heading ? `
        <div class="footer__disclaimer">
          <div class="container">
            <h4>${SITE.footerDisclaimer.heading}</h4>
            <p>${SITE.footerDisclaimer.body}</p>
          </div>
        </div>` : ""}
      </footer>`;
      </footer>`;
  }

  /* ---------- Drawers ---------- */
  let lastFocus = null;
  function open(id) {
    const d = document.getElementById(id + "-drawer"); if (!d) return;
    lastFocus = document.activeElement;
    d.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    const f = d.querySelector("button, a, input"); f && f.focus();
    if (id === "cart") renderDrawer();
  }
  function closeAll() {
    document.querySelectorAll(".drawer[aria-hidden=false], .modal[aria-hidden=false]").forEach(d => d.setAttribute("aria-hidden", "true"));
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  /* ---------- Cart drawer ---------- */
  function renderDrawer() {
    const wrap = document.querySelector("[data-cart-lines]"); const foot = document.querySelector("[data-cart-foot]");
    if (!wrap) return;
    const t = Cart.totals("standard");
    if (!t.lines.length) {
      wrap.innerHTML = `<div class="empty"><p>Your basket is empty.</p><a class="btn btn--primary" href="shop.html">Start shopping</a></div>`;
      foot.innerHTML = ""; return;
    }
    wrap.innerHTML = Cart.progressHTML(t, true) + t.lines.map(l => Cart.lineHTML(l)).join("") + Cart.upsellHTML(t, 2);
    foot.innerHTML = `${Cart.couponHTML(t)}${Cart.totalsHTML(t)}
      <a class="btn btn--primary btn--block btn--lg mt-2" href="checkout.html">Checkout</a>
      <a class="btn btn--ghost btn--block btn--sm mt-2" href="cart.html">View basket</a>`;
  }
  function updateCount() {
    const n = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(el => { el.textContent = n; el.dataset.empty = n === 0; });
  }

  /* ---------- Toasts ---------- */
  function toast(msg, type = "info", ms = 3200) {
    const box = document.querySelector(".toasts"); if (!box) return;
    const t = document.createElement("div"); t.className = `toast toast--${type}`; t.innerHTML = `<span>${msg}</span>`;
    box.appendChild(t); setTimeout(() => t.remove(), ms);
  }

  /* ---------- Product card ---------- */
  function productCard(p) {
    const prices = p.variants.map(v => v.price); const min = Math.min(...prices), max = Math.max(...prices);
    const inStock = p.variants.some(v => v.stock > 0);
    const was = p.variants.find(v => v.wasPrice)?.wasPrice;
    const badges = [...p.badges, ...(inStock ? [] : ["Sold out"])].map(b => `<span class="badge ${b === "New" ? "badge--accent" : b === "Sold out" ? "badge--light" : b === "Batch tested" ? "badge--success" : ""}">${b}</span>`).join("");
    const opt = Object.values(p.options).map(a => a.length).reduce((a, b) => a * b, 1);
    return `
      <article class="card">
        <div class="card__media">${Cart.tile(p)}<div class="card__badges">${badges}</div></div>
        <div class="card__body">
          <h3 class="card__title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="card__meta">${p.short}</div>
          ${opt > 1 ? `<div class="card__meta">${opt} options</div>` : ""}
          <div class="card__price">${min !== max ? `<span class="from">From</span>` : ""}${Cart.money(min)}${was ? `<span class="price--was">${Cart.money(was)}</span>` : ""}</div>
        </div>
        <div class="card__actions">
          ${opt > 1 || !inStock ? `<a class="btn btn--secondary btn--sm" href="product.html?id=${p.id}">${inStock ? "Choose options" : "View"}</a>`
            : `<button class="btn btn--primary btn--sm" type="button" data-quick-add="${p.id}" data-sku="${p.variants[0].sku}">Add to basket</button>`}
        </div>
      </article>`;
  }

  /* ---------- Init ---------- */
  /* If js/products.js has a typo the browser stops reading it, PRODUCTS
     never gets defined and every page would silently come up empty.
     This shows a clear message instead of a blank page. */
  function catalogueCheck() {
    const problems = [];
    if (!Array.isArray(window.PRODUCTS)) problems.push("js/products.js didn't load — it usually means a missing comma, an unclosed bracket, or a \" quote inside a \" quoted line.");
    else {
      const seen = new Set();
      window.PRODUCTS.forEach((p, i) => {
        const where = `Product ${i + 1}${p && p.name ? ` (${p.name})` : ""}`;
        if (!p.id) problems.push(`${where}: missing "id".`);
        else if (seen.has(p.id)) problems.push(`${where}: the id "${p.id}" is used twice.`);
        else seen.add(p.id);
        if (!p.name) problems.push(`${where}: missing "name".`);
        if (!Array.isArray(p.variants) || !p.variants.length) problems.push(`${where}: needs at least one entry in "variants".`);
        else p.variants.forEach(v => {
          if (!v.sku) problems.push(`${where}: a variant has no "sku".`);
          if (typeof v.price !== "number") problems.push(`${where}: variant ${v.sku || "?"} has no numeric "price".`);
        });
        if (p.Short && !p.short) problems.push(`${where}: "Short" should be lowercase "short".`);
        // The size/pack text appears twice — in "options" and again on each
        // variant. They have to match exactly, so flag any that don't.
        if (p.options && Array.isArray(p.variants)) {
          Object.keys(p.options).forEach(optName => {
            const allowed = p.options[optName] || [];
            p.variants.forEach(v => {
              const chosen = v.options ? v.options[optName] : undefined;
              if (chosen === undefined) {
                problems.push(`${where}: variant ${v.sku || "?"} is missing "${optName}".`);
              } else if (!allowed.includes(chosen)) {
                problems.push(`${where}: variant ${v.sku || "?"} has ${optName} "${chosen}", which isn't listed in options (${allowed.map(a => `"${a}"`).join(", ")}). The text must match exactly.`);
              }
            });
            const used = new Set(p.variants.map(v => v.options && v.options[optName]));
            allowed.filter(a => !used.has(a)).forEach(a =>
              problems.push(`${where}: ${optName} "${a}" is offered but no variant uses it, so it can never be bought.`));
          });
        }
        if (!Array.isArray(p.badges)) problems.push(`${where}: "badges" should be a list, e.g. badges: [].`);
      });
    }
    if (!problems.length) return true;
    console.error("Catalogue problems:\n" + problems.join("\n"));
    document.body.insertAdjacentHTML("afterbegin",
      `<div class="cat-error" role="alert"><strong>The product file needs fixing.</strong><ul>${
        problems.slice(0, 8).map(t => `<li>${t}</li>`).join("")
      }</ul><p>Edit <code>js/products.js</code>. Press F12 and open the Console tab for the exact line number. Customers won't see this message once it's fixed.</p></div>`);
    return false;
  }

  function init() {
    if (!catalogueCheck()) return;
    document.body.insertAdjacentHTML("afterbegin", header());
    document.body.insertAdjacentHTML("beforeend", footer());
    updateCount();
    document.addEventListener("cart:change", () => { updateCount(); renderDrawer(); });
    document.addEventListener("click", e => {
      const o = e.target.closest("[data-open]"); if (o) { open(o.dataset.open); return; }
      if (e.target.closest("[data-close]")) { closeAll(); return; }
      const qa = e.target.closest("[data-quick-add]");
      if (qa) { if (Cart.add(qa.dataset.quickAdd, qa.dataset.sku, 1)) { toast("Added to basket", "success"); open("cart"); } }
      if (e.target.closest("[data-open-cookie-prefs]")) { e.preventDefault(); window.Cookies && Cookies.openPrefs(); }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
    Cart.bind(document.getElementById("cart-drawer"));
    document.querySelectorAll("form.band__form, form[data-newsletter]").forEach(f => f.addEventListener("submit", e => { e.preventDefault(); toast("Thanks — you're on the list.", "success"); f.reset(); }));
    window.Cookies && Cookies.init();
  }
  document.addEventListener("DOMContentLoaded", init);

  return { icons, toast, open, closeAll, productCard, renderDrawer, page };
})();
