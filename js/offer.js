/* =========================================================
   FIRST-ORDER OFFER + WHATSAPP BUTTON
   - Offer panel slides up once per visitor after a short delay
     (never on basket/checkout, never over the age gate).
   - Marketing consent is a separate, unticked box (PECR): the
     code is shown whether or not they opt in to emails.
   ========================================================= */
(() => {
  const KEY = "ns_offer_seen_v1";
  const page = () => location.pathname.split("/").pop() || "index.html";
  const quietPages = ["cart.html", "checkout.html", "confirmation.html"];

  function whatsapp() {
    if (!SITE.whatsapp) return;
    const a = document.createElement("a");
    a.className = "wa-float";
    a.href = `https://wa.me/${SITE.whatsapp}`;
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Message us on WhatsApp");
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>';
    document.body.appendChild(a);
  }

  function offer() {
    const cfg = SITE.welcomeOffer;
    if (!cfg || !cfg.enabled || quietPages.includes(page())) return;
    try { if (localStorage.getItem(KEY)) return; } catch { return; }
    // Don't dangle a first-order code at someone who has already used it
    if (window.Discounts && cfg.code && Discounts.usedCodes().includes(cfg.code.toUpperCase())) return;

    const html = `
      <div class="offer" id="offer" role="dialog" aria-labelledby="offer-title" aria-hidden="true">
        <button class="offer__head" type="button" aria-expanded="true" aria-controls="offer-body" data-offer-toggle>
          <span id="offer-title">${cfg.headline}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="offer__body" id="offer-body">
          <form data-offer-form novalidate>
            <p>Enter your email to get your code, and choose whether you'd like to hear about new products and member offers.</p>
            <div class="field"><label for="offer-name">First name</label><input id="offer-name" name="name" autocomplete="given-name"></div>
            <div class="field"><label for="offer-email">Email address</label><input id="offer-email" name="email" type="email" autocomplete="email" required><div class="err">Enter a valid email address.</div></div>
            <label class="check"><input type="checkbox" name="consent" id="offer-consent"><span>Email me new products and offers. I can unsubscribe at any time. <a href="privacy.html"><u>Privacy policy</u></a></span></label>
            <button class="btn btn--primary btn--block" type="submit">Get my code</button>
            <button class="btn btn--ghost btn--block btn--sm" type="button" data-offer-dismiss>No thanks</button>
          </form>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    const el = document.getElementById("offer");
    const seen = () => { try { localStorage.setItem(KEY, "1"); } catch {} };

    const show = () => setTimeout(() => {
      if (document.querySelector(".drawer[aria-hidden=false], .modal[aria-hidden=false]")) return;
      el.setAttribute("aria-hidden", "false");
    }, (cfg.delaySeconds || 8) * 1000);
    if (window.AgeGate && AgeGate.pending) document.addEventListener("agegate:passed", show, { once: true }); else show();

    el.addEventListener("click", e => {
      if (e.target.closest("[data-offer-toggle]")) {
        const b = e.target.closest("[data-offer-toggle]"); const open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!open)); el.classList.toggle("is-collapsed", open);
      }
      if (e.target.closest("[data-offer-dismiss]")) { seen(); el.setAttribute("aria-hidden", "true"); }
      if (e.target.closest("[data-copy-code]")) {
        const code = cfg.code;
        navigator.clipboard?.writeText(code).then(() => UI.toast("Code copied", "success"), () => {});
      }
    });
    el.addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.target; const email = f.email.value.trim();
      const fd = f.querySelector("#offer-email").closest(".field");
      if (!/^\S+@\S+\.\S+$/.test(email)) { fd.classList.add("is-invalid"); f.email.focus(); return; }
      fd.classList.remove("is-invalid");
      if (cfg.endpoint) {
        try {
          await fetch(cfg.endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: f.name.value.trim(), email, marketingConsent: f.consent.checked, consentText: "Email me new products and offers.", at: new Date().toISOString(), source: "welcome-offer" }) });
        } catch { /* still show the code; sign-up can be retried */ }
      }
      seen();
      el.querySelector(".offer__body").innerHTML = `
        <div class="offer__code">
          <p>Your code for ${cfg.headline.toLowerCase()}:</p>
          <button type="button" class="code-chip" data-copy-code aria-label="Copy code ${cfg.code}">${cfg.code}<small>Tap to copy</small></button>
          <p class="note">Enter it in the discount box in your basket or at checkout.</p>
          <button class="btn btn--primary btn--block" type="button" data-offer-dismiss>Start shopping</button>
        </div>`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => { whatsapp(); offer(); });
})();
