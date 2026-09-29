# North Shore — Performance Nutrition (static storefront)

A premium, mobile-first supplement store built as plain HTML/CSS/JS for GitHub Pages, with a working basket, discount codes, an 18+ age gate, a batch-certificate library and a one-page checkout that hands off to Shopify (or Stripe) for payment.

```
/
├── index.html            Home: hero, trust bar, categories, best sellers, quality, reviews, FAQ, newsletter
├── shop.html             All products: search, category/price/stock/tag filters, sort, filter chips
├── product.html          Product template (reads ?id= from js/products.js): variants, qty, add/buy now, tabs, related
├── cart.html             Basket: free-delivery bar, pill quantity steppers, "goes well with", discount code
├── checkout.html         One page: Contact → Delivery method → Address → Payment (payment handled off-site)
├── quality.html          Quality & testing standards
├── coa.html              Batch certificate library: search → product → batch → certificate viewer
├── disclaimer.html       Supplement, product-information and regulatory disclaimer
├── confirmation.html     Order confirmation (also the Stripe success_url)
├── about / faq / contact / shipping / returns / terms / privacy / cookies / account / 404
├── css/style.css         Design system + all page styles
├── js/config.js          ← brand, shipping rules, payment mode. Edit this first.
├── js/products.js        ← product catalogue. Edit this second.
├── js/discounts.js       ← discount codes.
├── js/cart.js            Basket (localStorage), totals, rendering
├── js/checkout.js        Checkout steps, validation, payment handoff
├── js/cookies.js         UK GDPR/PECR consent banner + preferences
├── js/age-gate.js        18+ entry gate (on/off in config.js)
├── js/offer.js           First-order code pop-up + floating WhatsApp button
├── js/coa.js             ← batch certificates. Replace the samples with real ones.
├── js/main.js            Header/footer, drawers, toasts, product cards
├── assets/favicon.png    favicon + apple-touch-icon · robots.txt · sitemap.xml · .nojekyll
├── images/               logo-mark.png, logo-wordmark.png (cut from your logo), hero and social images
```

See **PRODUCTS.md** for how to add, change and remove products safely.

`sitemap.xml` maintains itself: a GitHub Action rebuilds it from `js/products.js`
on every push that changes products. Nothing to do by hand.

## 1. Run it locally

Any static server works. From the folder:

```
python3 -m http.server 8080
```

then open http://localhost:8080. Payment is in **demo mode** by default, so you can test the whole flow — basket, codes, checkout, confirmation — without any accounts.

## 2. Make it yours

| What | Where |
|---|---|
| Brand name, tagline, company details, announcement bar | `js/config.js` → `SITE` |
| Delivery options, prices, free-delivery threshold | `js/config.js` → `SITE.shipping` |
| The "Are you buying as" question at checkout | `js/config.js` → `SITE.buyerTypes` |
| Products, variants, prices, stock, nutrition | `js/products.js` |
| Discount codes | `js/discounts.js` |
| Colours, fonts, spacing | `css/style.css` → `:root` (brand red `--blue-500`, black `--navy-900`) and the "NORTH SHORE BRAND" block at the end |
| Logo | `images/logo-mark.png`, `images/logo-wordmark.png`, `assets/favicon.png` (swap for vector/transparent files from your designer when you have them) |
| Domain in canonical/OG tags, sitemap, robots | search-and-replace `YOUR-DOMAIN.co.uk` |
| Legal placeholders | anything in `[SQUARE BRACKETS]` on terms/privacy/returns/contact/about |

Product images: the design ships with generated "tile" artwork so it looks finished with no photos. To use real photos, add them to `/images/` and replace `Cart.tile(p)` calls with `<img src="images/${p.id}.jpg" alt="${p.name}">` in `js/main.js` (`productCard`), `js/cart.js` (`lineHTML`) and `product.html`.

## 2a. What's modelled on the reference sites

| Reference | Feature | Where |
|---|---|---|
| BioLab basket | Blue free-delivery banner with progress pill and "Continue shopping" | `Cart.progressHTML` in `js/cart.js` |
| BioLab basket | Pill quantity stepper, bin icon, promo-code pill with attached button | `js/cart.js`, `css/style.css` |
| BioLab basket | "Goes well with" add-ons, spend-more nudge | `Cart.upsellHTML`, `Cart.nudgeHTML`; set `nudge: true` on a code |
| Rebirth | "Get X% off your first order" pop-up | `js/offer.js`, `SITE.welcomeOffer` |
| Rebirth checkout | Single page, "Show order summary" bar on mobile, "+ Add address line 2", secure-payment note, T&Cs tick box | `js/checkout.js` |
| Both | Floating chat button | `SITE.whatsapp` |

Deliberate differences: marketing opt-ins are **unticked** by default (Rebirth pre-ticks theirs, which isn't valid consent under UK GDPR/PECR); there's no "shipping protection" add-on; there are no star ratings or reviews until you have genuine ones.

## 2b. Age gate, offer pop-up, WhatsApp

All in `js/config.js`:

- `ageGate.enabled` — shows an 18+ self-declaration on first visit, remembered for `rememberDays`. It isn't identity verification. Ordinary food supplements don't legally need one; it's there because some products (high-caffeine pre-workouts) are labelled not for under-18s.
- `welcomeOffer` — the first-order code pop-up. Set `endpoint` to your email platform's form endpoint (Klaviyo, Mailchimp, Formspree…) so sign-ups are saved. Until then the code is shown but the email goes nowhere.
- `whatsapp` — your WhatsApp Business number in international format (`447…`). Set to `""` to hide the button.

## 2c. Batch certificates

`js/coa.js` holds one entry per tested batch; the certificates page and each product's "Batch certificates" tab read from it. Put the PDFs in `/coa/` and set `pdf: "coa/FILE.pdf"`. The shipped entries are labelled **Sample** on the site — delete them. Only publish certificates the laboratory actually issued, and only give a product the "Batch tested" badge when it has one.

## 3. Discount codes

Defined in `js/discounts.js`. Types:

- `percent` — e.g. `WELCOME10` = 10% off eligible items
- `fixed` — e.g. `PROTEIN5` = £5 off, optionally restricted to `categories` or `products` and a `minSpend`
- `shipping` — free standard delivery

Ships with: `WELCOME10`, `MEMBER15`, `PROTEIN5`, `FREESHIP`, `BUNDLE20`.

The site validates codes client-side so the customer sees the right total. **Your payment backend must validate them again** before charging — the Stripe function below does this by looking up the same code as a Stripe Coupon/Promotion Code, and Shopify applies its own discount rules.

### One use per customer — where it's really enforced

`WELCOME10` is marked `oncePerCustomer: true`. The site remembers, on that
device, that it's been used and refuses it a second time with a clear message.

**That is a courtesy, not a control.** Anything the browser remembers can be
wiped by clearing site data, opening a private window or switching device.
A static site cannot enforce a usage limit, and no amount of front-end code
changes that.

The limit has to be set where the money is taken:

- **Shopify** — Discounts → your code → Usage limits → tick
  **"Limit to one use per customer"**. Shopify checks it against the customer
  account or email at checkout and rejects reuse. Set this for every code you
  mark `oncePerCustomer` here.
- **Your own backend (Fena / crypto)** — before charging, look the code up
  against a record of who has used it and refuse it if it's been used. Never
  trust the total the browser sends.

Until one of those is in place, assume every code is reusable.

On pricing: a `wasPrice` on a variant shows a struck-through price. Under the Digital Markets, Competition and Consumers Act 2024 a "was" price must be a price the product was genuinely sold at for a reasonable period beforehand — the CMA can fine for misleading reference prices without going to court. Use it for real reductions; use discount codes for intro offers and member pricing off an honest list price.

## 4. Payments

The static site never touches card details or private keys. It collects the
basket, the delivery details and the chosen payment method, then hands off.

### The payment options shown at checkout

Edit `js/config.js` → `SITE.payment.methods`. Each entry is one option in the
"Payment Options" list:

```js
      { id: "fena",    label: "Pay with Fena", blurb: "...",
        choices: ["Pay by Bank", "Card", "All-in-one checkout"], default: true },
      { id: "bitcoin", label: "Bitcoin", offer: "20% off your first Bitcoin order",
        discount: 20, icon: "bitcoin", blurb: "..." }
```

- `discount` takes that percentage off the order as soon as the option is
  selected, and shows as its own line in the summary.
- `SITE.payment.stackDiscounts` controls whether a discount code and a payment
  discount can both apply. It ships as `false`, so a code wins and the customer
  is told why.
- Delete an entry to remove that option. The `id` is what reaches your backend.

### Fena (pay by bank)

[Fena](https://www.fena.co/) is a UK open-banking provider: the customer
approves the payment in their own banking app, so there are no card fees and
no chargebacks.

Two ways to connect it:

1. **Payment links — no code.** Create a link in the Fena dashboard and send it
   after the order. Fine for a handful of orders a week; manual beyond that.
2. **Payments API — automatic.** Your backend calls Fena with the order total,
   gets back a URL, and the site sends the customer there. Fena posts the
   result to a webhook when it's paid. Their docs are at
   [toolkit-docs.fena.co](https://toolkit-docs.fena.co/partner-api/apis/single-payments/overview),
   and there's a sandbox with a test bank account for trying it before going
   live. If you ever move the shop to WordPress there's also an official
   WooCommerce plugin.

The API key is a **secret** — it goes in your backend's environment variables,
never in this repo.

REQUIRES CURRENT PROVIDER CONFIRMATION: fees, onboarding checks and the exact
API fields. Confirm with Fena when you apply.

### Bitcoin

Use a payment processor rather than handling wallets yourself — BTCPay Server
(self-hosted, no fees), Coinbase Commerce, OpenNode or similar. They generate
the address, watch the blockchain, hold the exchange rate for a set window and
tell your backend when the payment confirms.

Three things to plan for before switching it on:

- **Refunds.** Crypto payments can't be reversed. Under the Consumer Rights Act
  a customer can still return goods and get their money back, so decide now
  whether you refund in GBP by bank transfer or in Bitcoin at that day's rate,
  and say which in your returns policy.
- **Volatility.** Quote a rate that expires — 15 to 30 minutes is normal.
- **Record keeping.** HMRC treats crypto received as payment as ordinary
  business income, recorded in GBP at the value on the day. Your accountant
  will want the GBP figure on every order.

### The backend

Both routes need one small server-side function. The frontend POSTs the order
to it, it talks to Fena or the crypto processor with the secret key, and returns
a URL to send the customer to. Cloudflare Workers, Vercel and Netlify Functions
all have free tiers that cover this.

It must **recompute the total from your own prices** — never trust the figure
the browser sends. The order payload includes `payment` and `paymentChoice` so
it knows which rail to use, plus `clientTotals` for comparison only.

### Shopify instead

Set `mode: "shopify"` and the checkout hands the basket to Shopify's hosted
checkout, which handles cards, Apple Pay, Google Pay, emails, orders and
refunds for you. Shopify has apps for both pay-by-bank and crypto, so you can
keep these options without writing a backend at all. This is the least work
if you want to be live quickly.

## 5. Deploy to GitHub Pages

1. Create a repo (e.g. `northshore-site`), upload all files (keep `.nojekyll`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. Site is live at `https://USERNAME.github.io/northshore-site/` in a minute or two.
4. Custom domain: add a `CNAME` file containing `www.yourdomain.co.uk`, set a CNAME record at your registrar pointing `www` to `USERNAME.github.io`, then tick *Enforce HTTPS* in Pages settings once the certificate issues.
5. Updates: edit files → commit → push. Rollback: `git revert` the commit, or pick an earlier commit in the GitHub UI and restore.

## 5a. Two products to check with your supplier

**Sleep** — melatonin is a **prescription-only medicine in the UK** and cannot
be sold as a food supplement, whatever the dose. If your sleep product contains
melatonin you can't list it. Magnesium, glycine, L-theanine, valerian and
similar are fine. Confirm the formulation before it goes on sale.

**Caffeine** — products with more than 150 mg/l or 150 mg per portion must
carry the statutory warning "High caffeine content. Not recommended for
children or pregnant or breast-feeding women", followed by the caffeine
content in mg per serving. It's already in the product description; make sure
it's on the label too.

Vitamins and minerals also have legal maximum levels and must show the % NRV
per serving. Take all of these from your supplier's specification.

## 6. Before launch

- Replace every `[PLACEHOLDER]` and `YOUR-DOMAIN.co.uk`
- Company registered, business bank account, product liability insurance
- Products: labels compliant with UK food supplement rules (Food Supplements Regulations 2003, allergen and NRV labelling); any health claims limited to authorised claims on the GB nutrition and health claims register; food business registration with your local authority
- Replace the sample products, nutrition, ingredients and allergens with the real label information
- Delete the sample certificates in `js/coa.js`; publish only real ones
- Check every promise in `SITE.promises` (dispatch time, returns) is true
- Only add reviews once they're genuine and verified (the DMCC Act 2024 bans fake reviews)
- Wire the first-order pop-up to your email platform (`welcomeOffer.endpoint`) and set your WhatsApp number
- Payment provider approved and a real test order placed and refunded
- Confirmation email tested; contact form wired to a form service
- Terms, privacy, returns reviewed by a solicitor; ICO registration
- Analytics ID added to `config.js` only if you want analytics (loads only after consent)
- Lighthouse pass: this build scores well out of the box (no external images, one font request, ~50 KB CSS+JS)
