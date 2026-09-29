# Adding and changing products

Everything in the shop comes from one file: **`js/products.js`**.
You never need to touch any other file to add, remove or reprice a product.

---

## The shape of the file

```js
window.PRODUCTS = [
  { ...first product... },
  { ...second product... },
  { ...last product, no comma after it... }
];
```

Three rules cause almost every breakage:

1. **A comma after every product except the last one.**
2. **Never a `"` inside a `"…"` line.** Use `'single quotes'` inside instead.
3. **Every `{` has a matching `}`, and the file ends with exactly one `];`.**

---

## Template — copy this whole block

Paste it above the final `];`, put a comma after the product before it, then fill it in.

```js
  {
    id: "my-product",                       // lowercase, no spaces — becomes the page address
    name: "My Product",                     // shown to customers
    category: "Standards",                  // free text, not used for navigation
    form: "bottle",                         // bottle | jar | pouch | bar — picks the artwork
    tint: "rgba(216,20,44,.35)",            // accent colour behind the artwork
    short: "One line shown on the card.",   // lowercase "short"
    description: "A paragraph for the product page.",
    badges: [],                             // [] or "Best seller" / "New" / "Batch tested"
    options: { Size: ["500 ml"] },          // the choices a customer picks
    variants: [
      { sku: "MY-500", options: { Size: "500 ml" }, price: 29.00, stock: 25 }
    ],
  }
```

### Sizes appear twice — they must match exactly

This is the one edit that catches people out. A size or pack name is written
in **two** places: once in `options` (the list of choices) and again on every
`variant` that uses it.

```js
    options: { Size: ["90 capsules", "180 capsules"] },      ← here
    variants: [
      { sku: "PRO-90",  options: { Size: "90 capsules" },  price: 24.99, stock: 40 },
      { sku: "PRO-180", options: { Size: "180 capsules" }, price: 39.99, stock: 25 }
    ],                                   ↑ and here, character for character
```

Change "90 capsules" to "120 capsules" in the first place only and that option
becomes unbuyable. The site now catches this: you'll get a yellow banner naming
the product, the SKU and both versions of the text, instead of a silently
broken selector. It also warns if you list a size no variant uses.

Change it in both places and you're fine.

### Options and variants

`options` lists the choices. `variants` needs **one entry per combination**.

One choice, three sizes → three variants:

```js
    options: { Size: ["250 ml", "500 ml", "1 L"] },
    variants: [
      { sku: "BUF-250", options: { Size: "250 ml" }, price: 18.00, stock: 40 },
      { sku: "BUF-500", options: { Size: "500 ml" }, price: 29.00, stock: 32 },
      { sku: "BUF-1L",  options: { Size: "1 L" },    price: 48.00, stock: 12 }
    ],
```

Two choices → one variant for each pairing (2 × 2 = 4):

```js
    options: { Pack: ["100", "500"], Size: ["2 ml", "10 ml"] },
    variants: [
      { sku: "V-100-2",  options: { Pack: "100", Size: "2 ml" },  price: 12.50, stock: 120 },
      { sku: "V-100-10", options: { Pack: "100", Size: "10 ml" }, price: 16.50, stock: 90 },
      { sku: "V-500-2",  options: { Pack: "500", Size: "2 ml" },  price: 52.00, stock: 40 },
      { sku: "V-500-10", options: { Pack: "500", Size: "10 ml" }, price: 68.00, stock: 0 }
    ],
```

Any combination you leave out is shown greyed out. `stock: 0` shows "Sold out".

### Prices

Plain numbers, no `£` and no quotes: `price: 29.00`, not `price: "£29.00"`.

There's an optional `wasPrice` that shows a struck-through price. Only use it for a
price the product genuinely sold at recently — a permanent fake "was" price is a
misleading reference price under the DMCC Act 2024 and the CMA can fine for it
directly. Use discount codes for intro offers instead.

---

## The assurance panel

The lab and shipping panel on each product page — three stats across the top,
then green PASSED pills — is set **once** in `js/config.js` under `assurance`,
and every product uses it:

```js
  assurance: {
    stats: [
      { icon: "flask",  value: "Lab tested", label: "Independent UK lab" },
      { icon: "search", value: "99.8%",      label: "HPLC verified" },
      { icon: "truck",  value: "Tracked",    label: "Shipped from the UK" }
    ],
    checks: [
      { label: "Identity & purity", pass: true },
      { label: "Batch certificate published", pass: true }
    ]
  },
```

`value` is the bold line, `label` the small caption underneath. Icons available:
`flask`, `search`, `truck`, `shield`, `check`, `pin`, `return`, `leaf`.

`checks` renders one pill each. `pass: true` is green and says PASSED;
`pass: false` is grey and says PENDING. Two pills fit side by side; more will
wrap. Keep the labels short.

**To give one product different figures**, add its own `assurance` block inside
that product in `products.js` — see Reference Standard 1 for a worked example.
It replaces the site-wide one for that product only.

Keep the stats short: `Lab tested`, `99.8%`, `2-day shipping`. Long values wrap
and the row stops looking clean.

**Only state results you actually hold a certificate for.** A purity figure or a
PASSED pill is a factual claim about the product — if you can't point to the
certificate behind it, leave the row out.

---

## Product images

Every product has an `image` line pointing at a file in `images/products/`:

```js
    image: "images/products/my-product.jpg",
```

The folder already contains a placeholder for each product, plus a generic
`placeholder.jpg`. They're branded black-and-red squares that say
IMAGE PLACEHOLDER, so the site looks finished before you have photos.

**To add a real photo:** save it as a `.jpg` named after the product id, and
upload it to `images/products/`, replacing the placeholder. Keep the same
filename and you don't touch the code at all.

On GitHub: open `images` → `products` → **Add file → Upload files**, drop the
photo in, and commit. Same name = replaced.

**Photo tips**
- Square, around 1000 × 1000 pixels. The site crops to a square, so anything
  else loses its top and bottom.
- Keep each file under about 300 KB or pages get slow. Squoosh.app will shrink
  them for free.
- Same background and framing across all products — it's what makes a shop look
  professional.

**If a file is missing**, the site quietly shows `placeholder.jpg` instead, so a
typo in a filename never leaves a broken image on the page.

**To add a photo for a new product**, add the `image` line to the product and
upload a file with a matching name. Leave the line out entirely and the product
gets the generic placeholder.

---

## Changing a product name — the whole procedure

1. Open `js/products.js`.
2. Find the product and change **one line**:

```js
    name: "Creatine",          →    name: "Creatine Monohydrate",
```

3. Commit. Done.

**Leave `id` alone.** It's the internal reference, customers never see it, and
changing it means three more edits (the image filename, `js/coa.js` and the
sitemap). There's nothing to gain.

The new name appears everywhere at once — shop cards, the product page,
related products, best sellers, search, the basket, the "goes well with"
suggestions, the checkout summary, the order confirmation and the certificate
library. You never type it twice.

Worth updating at the same time, since these also show to customers:
`short`, `description`, and the `price` on each variant.


## Renaming things — what's safe

| You change | Safe? | What to do |
|---|---|---|
| `name` | **Yes, always** | Nothing else. Cards, product page, basket and certificates all follow it. |
| `short`, `description`, any label text | **Yes, always** | Nothing else. |
| `price`, `stock` | **Yes, always** | Nothing else. |
| `image` | **Yes** | Upload a file with the matching name to `images/products/`. |
| `sku` | Yes, for now | Once Shopify is connected these must match Shopify's records. |
| `id` | Careful | Three linked edits — see below. |

### One change, everywhere

`js/products.js` is the single source. Change a product's name there and it
updates on the shop cards, the product page, **related products**, best
sellers, search, the basket, the "goes well with" suggestions, the checkout
summary, the order confirmation and the certificate library — all at once.
You never edit the same text twice.

The one file that doesn't read from `products.js` is `sitemap.xml` — it's a
plain list for search engines. **You don't have to touch it.** A GitHub Action
(`.github/workflows/sitemap.yml`) rebuilds it for you whenever you push a
change to `products.js`, and it picks up your custom domain from the `CNAME`
file automatically.

You'll see a second commit appear from `github-actions[bot]` a moment after
yours — that's the sitemap updating itself.

To rebuild it by hand instead: `node tools/build-sitemap.mjs`, or open the
**Actions** tab on GitHub and run "Update sitemap".

And nothing on the site breaks if the sitemap is out of date — only search
engines miss the page.

**The `id` is the only one to think about.** It's the product's internal
reference and customers never see it, so there's usually nothing to gain by
changing it. If you do, three things need to follow:

1. the `image` line, and the filename in `images/products/`
2. any `product:` entry in `js/coa.js` that used the old id
3. `sitemap.xml`

Miss any of those and nothing crashes — the image falls back to the
placeholder, a certificate shows the raw id instead of the product name, and
an old link lands on a "We couldn't find that product" page. But it looks
careless, so do it in one go.

**The safe way to swap a product out entirely:** keep the `id`, and change the
`name`, `short`, `description`, `image`, `price` and label. The old id sitting
quietly in the code costs you nothing.

---

## The three everyday jobs

**Change a price** — find the variant, change the number. Nothing else.

**Mark something out of stock** — set `stock: 0` on that variant.

**Remove a product** — delete from its opening `{` to its closing `},` inclusive.
If you delete the last one, remove the comma from the new last product.

---

## Check before you commit

**Quickest check, no tools:** in GitHub's editor, look at the colours. Product text
should be one colour and the field names another. If a whole block suddenly turns
the same colour after your edit, you've broken a quote or a bracket right before
where the colour changes.

**Proper check:** open the site, press **F12**, click the **Console** tab.
A syntax error tells you the file and the line number. Fix it, reload, repeat.

**Safety net:** if `products.js` is broken the site no longer comes up blank. It
shows a yellow banner listing what's wrong — a missing price, a duplicate id, a
capital `Short` — so you can see the problem without opening the console. Once
fixed, the banner disappears on its own.

**Safest habit:** before a big edit, copy `products.js` somewhere as a backup.
If an edit goes wrong you can paste the old one back and be live again in a minute.
On GitHub you can also open the file's **History** and restore any earlier version.

---

## After connecting Shopify

Each variant also needs its Shopify variant ID:

```js
      { sku: "BUF-500", options: { Size: "500 ml" }, price: 29.00, stock: 32, shopifyVariantId: "1234567890" }
```

Prices and stock must match what's in Shopify, because Shopify charges from its own
records, not from this file. If an ID is missing, the checkout button says so rather
than sending a broken basket.
