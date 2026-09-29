/* =========================================================
   AGE VERIFICATION
   A self-declaration gate, shown on first visit. It records the
   visitor's answer in localStorage (strictly necessary storage,
   so no cookie consent is needed for it) for SITE.ageGate.rememberDays.

   What it is: a statement of who the shop is for, and a prompt for
   under-18s to leave. What it is not: identity or age verification.
   It does not make any sale lawful that otherwise wouldn't be, and
   it does not replace checking age at delivery or collection where a
   product legally requires it.
   ========================================================= */
(() => {
  const cfg = window.SITE && SITE.ageGate;
  if (!cfg || !cfg.enabled) return;
  const KEY = "ns_age_ok_v1";

  let ok = false;
  try {
    const rec = JSON.parse(localStorage.getItem(KEY) || "null");
    ok = !!rec && Date.now() - rec.at < cfg.rememberDays * 864e5;
  } catch { /* storage blocked: show the gate each visit */ }
  if (ok) return;

  const html = `
    <div class="gate" id="age-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-describedby="gate-desc">
      <div class="gate__panel">
        <div class="gate__mark" aria-hidden="true">${cfg.minAge}+</div>
        <h2 id="gate-title">Age verification</h2>
        <p id="gate-desc">You must be ${cfg.minAge} or over to enter this website.</p>
        <div class="gate__actions">
          <button type="button" class="btn btn--primary btn--lg" data-gate="yes">I am ${cfg.minAge} or over</button>
          <a class="btn btn--secondary btn--lg" href="${cfg.exitUrl}" data-gate="no" rel="nofollow">Exit</a>
        </div>
        <p class="gate__small">We store your answer on this device for ${cfg.rememberDays} days so we don't ask again. See our <a href="cookies.html">cookie policy</a>.</p>
      </div>
    </div>`;

  function mount() {
    document.body.insertAdjacentHTML("beforeend", html);
    const gate = document.getElementById("age-gate");
    // Header/footer are injected later by main.js, so re-apply inert once the page has built.
    const lock = () => [...document.body.children].forEach(el => { if (el !== gate) el.setAttribute("inert", ""); });
    lock();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(() => { lock(); gate.querySelector("[data-gate=yes]").focus(); }, 0));
    document.documentElement.classList.add("gate-open");
    const yes = gate.querySelector("[data-gate=yes]");
    yes.focus();

    gate.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const f = [...gate.querySelectorAll("button, a")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    yes.addEventListener("click", () => {
      try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now() })); } catch {}
      [...document.body.children].forEach(el => el.removeAttribute("inert"));
      document.documentElement.classList.remove("gate-open");
      gate.remove();
      document.dispatchEvent(new CustomEvent("agegate:passed"));
    });
  }

  window.AgeGate = { pending: true };
  document.addEventListener("agegate:passed", () => { window.AgeGate.pending = false; });
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
