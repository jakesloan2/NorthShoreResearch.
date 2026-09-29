/* =========================================================
   COOKIE CONSENT — UK GDPR / PECR.
   Non-essential scripts (analytics, marketing) only load
   after the visitor opts in. Essential cookies (basket,
   consent record) always work.
   ========================================================= */
window.Cookies = (() => {
  const KEY = "ns_consent_v1";
  const defaults = { essential: true, functional: false, analytics: false, marketing: false };

  function get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function save(c) { localStorage.setItem(KEY, JSON.stringify({ ...c, essential: true, at: new Date().toISOString() })); apply(c); }

  function apply(c) {
    if (c.analytics && SITE.analytics.ga4 && !window.__ga) {
      window.__ga = true;
      const s = document.createElement("script"); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.analytics.ga4}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; function gtag(){ dataLayer.push(arguments); } gtag("js", new Date()); gtag("config", SITE.analytics.ga4, { anonymize_ip: true });
    }
    // Marketing pixels would be loaded here in the same way, only when c.marketing is true.
  }

  function bannerHTML() {
    return `
      <div class="cookie" id="cookie-banner" role="region" aria-label="Cookie consent" aria-hidden="true">
        <p>We use essential cookies to make the site work and, with your permission, analytics cookies to understand how it's used. <a href="cookies.html"><u>Cookie policy</u></a></p>
        <div class="cookie__actions">
          <button class="btn btn--primary btn--sm" data-cookie="accept">Accept all</button>
          <button class="btn btn--secondary btn--sm" data-cookie="reject">Reject non-essential</button>
          <button class="btn btn--ghost btn--sm" data-cookie="manage">Manage</button>
        </div>
      </div>
      <div class="modal" id="cookie-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__panel">
          <h3 id="cookie-title">Cookie preferences</h3>
          <p class="muted">Choose which cookies you're happy for us to use. You can change this at any time from the footer.</p>
          ${row("essential", "Essential", "Needed for the basket, checkout and remembering this choice. Always on.", true, true)}
          ${row("functional", "Functional", "Remembers preferences like recently viewed products.")}
          ${row("analytics", "Analytics", "Anonymous usage statistics so we can improve the site.")}
          ${row("marketing", "Marketing", "Used to measure and personalise advertising on other platforms.")}
          <div class="step-actions">
            <button class="btn btn--secondary" data-cookie="reject">Reject non-essential</button>
            <button class="btn btn--primary" data-cookie="save">Save preferences</button>
          </div>
        </div>
      </div>`;
  }
  function row(id, title, desc, on = false, locked = false) {
    return `<div class="pref"><div><strong>${title}</strong><span>${desc}</span></div>
      <label class="switch"><input type="checkbox" name="${id}" ${on ? "checked" : ""} ${locked ? "disabled" : ""} aria-label="${title} cookies"><i></i></label></div>`;
  }

  function openPrefs() {
    const m = document.getElementById("cookie-modal"); const c = get() || defaults;
    m.querySelectorAll("input[type=checkbox]").forEach(i => { if (!i.disabled) i.checked = !!c[i.name]; });
    m.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    m.querySelector("input:not([disabled])").focus();
  }
  function hideAll() {
    document.getElementById("cookie-banner").setAttribute("aria-hidden", "true");
    document.getElementById("cookie-modal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function init() {
    document.body.insertAdjacentHTML("beforeend", bannerHTML());
    const c = get();
    if (!c) document.getElementById("cookie-banner").setAttribute("aria-hidden", "false"); else apply(c);
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-cookie]"); if (!b) return;
      const act = b.dataset.cookie;
      if (act === "accept") { save({ functional: true, analytics: true, marketing: true }); hideAll(); UI.toast("Cookie preferences saved", "success"); }
      if (act === "reject") { save({ functional: false, analytics: false, marketing: false }); hideAll(); UI.toast("Only essential cookies will be used", "info"); }
      if (act === "manage") openPrefs();
      if (act === "save") {
        const m = document.getElementById("cookie-modal"); const out = {};
        m.querySelectorAll("input[type=checkbox]").forEach(i => out[i.name] = i.checked);
        save(out); hideAll(); UI.toast("Cookie preferences saved", "success");
      }
    });
  }
  return { init, openPrefs, get };
})();
