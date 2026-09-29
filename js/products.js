/* =========================================================
   PRODUCT CATALOGUE — mg-dosed supplement range

   SIZES, PRICES AND STOCK BELOW ARE PLACEHOLDERS.
   Everything marked [LIKE THIS] needs your real figures.
   Search this file for "[" to find them all.

   STRUCTURE — the whole file is one list:

     window.PRODUCTS = [
  { ...product... },     ← comma after every product
       { ...product... }      ← except the last one
     ];                       ← list closed exactly once

   PRODUCT FIELDS
     id           unique, lowercase, no spaces — used in the page URL
     image        photo for the card and product page. Put the file in
                  images/products/ and name it after the id. If it's
                  missing the site shows images/products/placeholder.jpg.
     name         shown to customers
     category     all products use "All" — category navigation is off
     form         jar | pouch | bar | bottle (fallback artwork only)
     tint         accent colour behind the fallback artwork
     short        one line shown on the card
     description  paragraph on the product page
     badges       [] or any of: "Best seller", "New", "Batch tested"
     options      the strengths a customer picks, in mg
     variants     one entry per strength, each with its own sku,
                  price and stock. A variant can also carry its own
                  "image" — use it when the strengths look different
                  (bigger tub, different label). Without one it falls
                  back to the product's image.
     assurance    optional — overrides SITE.assurance in js/config.js

   THE ONE THING THAT CATCHES PEOPLE OUT
     Each strength is written TWICE — once in "options" and again on the
     variant that uses it. They must match character for character, e.g.
     "500 mg" in both, never "500mg" in one and "500 mg" in the other.
     If they drift apart the site shows a yellow banner naming the
     product and the SKU, so you'll know straight away.

   SKU FORMAT
     <PRODUCT>-<STRENGTH>MG — e.g. CRE-1000MG, CAF-200MG.
     Rename freely; they just have to stay unique across the file.

   CLAIMS
     Only use health claims on the GB nutrition and health claims
     register, with their conditions of use. Describe what's in a
     product and how much — not what it does.
   ========================================================= */
window.PRODUCTS = [
  {
    id: "creatine",
    image: "images/products/creatine.jpg",
    name: "Creatine",
    category: "All",
    form: "jar",
    tint: "rgba(216,20,44,.45)",
    short: "Creatine monohydrate. [X] capsules per bottle.",
    description: "[SUPPLIER DESCRIPTION] Creatine increases physical performance in successive bursts of short-term, high-intensity exercise. The beneficial effect is obtained with a daily intake of 3 g.",
    badges: ["Best seller"],
    options: { Strength: ["1000 mg", "3000 mg", "5000 mg"] },
    variants: [
      { sku: "CRE-1000MG", options: { Strength: "1000 mg" }, price: 14.99, stock: 40, image: "images/products/creatine-1000mg.jpg" },
      { sku: "CRE-3000MG", options: { Strength: "3000 mg" }, price: 19.99, stock: 30, image: "images/products/creatine-3000mg.jpg" },
      { sku: "CRE-5000MG", options: { Strength: "5000 mg" }, price: 24.99, stock: 20, image: "images/products/creatine-5000mg.jpg" }
    ]
  },
  {
    id: "protein-capsules",
    image: "images/products/protein-capsules.jpg",
    name: "Protein Capsules",
    category: "All",
    form: "bottle",
    tint: "rgba(216,20,44,.3)",
    short: "Protein in capsule form. [X] capsules per bottle.",
    description: "[SUPPLIER DESCRIPTION] Protein contributes to a growth in muscle mass and to the maintenance of normal bones.",
    badges: ["Best seller"],
    options: { Strength: ["500 mg", "1000 mg"] },
    variants: [
      { sku: "PRO-500MG",  options: { Strength: "500 mg" },  price: 24.99, stock: 40, image: "images/products/protein-capsules-500mg.jpg" },
      { sku: "PRO-1000MG", options: { Strength: "1000 mg" }, price: 39.99, stock: 25, image: "images/products/protein-capsules-1000mg.jpg" }
    ]
  },
  {
    id: "caffeine",
    image: "images/products/caffeine.jpg",
    name: "Caffeine",
    category: "All",
    form: "bottle",
    tint: "rgba(240,56,78,.35)",
    short: "[X] tablets. High caffeine content.",
    // High-caffeine products must carry the statutory warning on the label:
    // "High caffeine content. Not recommended for children or pregnant or
    // breast-feeding women", with the amount in mg per serving.
    description: "[SUPPLIER DESCRIPTION] High caffeine content. Not recommended for children or pregnant or breast-feeding women.",
    badges: [],
    options: { Strength: ["200 mg"] },
    variants: [
      { sku: "CAF-200MG", options: { Strength: "200 mg" }, price: 11.99, stock: 50 }
    ]
  },
  {
    id: "electrolyte",
    image: "images/products/electrolyte.jpg",
    name: "Electrolyte",
    category: "All",
    form: "pouch",
    tint: "rgba(200,200,210,.35)",
    short: "Sodium, potassium and magnesium. [X] servings.",
    description: "[SUPPLIER DESCRIPTION — list the minerals and the amount of each per serving.]",
    badges: ["New"],
    options: { Strength: ["1000 mg"] },
    variants: [
      { sku: "ELE-1000MG", options: { Strength: "1000 mg" }, price: 18.99, stock: 30 }
    ]
  },
  {
    id: "vitamin",
    image: "images/products/vitamin.jpg",
    name: "Vitamin",
    category: "All",
    form: "bottle",
    tint: "rgba(216,20,44,.25)",
    short: "[X] tablets. [X] servings.",
    // Vitamins and minerals have legal maximum levels and must show the
    // % NRV per serving on the label. Take these from your supplier.
    description: "[SUPPLIER DESCRIPTION — name the vitamin, the amount per serving and the % NRV.]",
    badges: [],
    options: { Strength: ["1000 mg"] },
    variants: [
      { sku: "VIT-1000MG", options: { Strength: "1000 mg" }, price: 14.99, stock: 50 }
    ]
  },
  {
    id: "sleep",
    image: "images/products/sleep.jpg",
    name: "Sleep",
    category: "All",
    form: "bottle",
    tint: "rgba(120,120,130,.35)",
    short: "[X] capsules. [X] servings.",
    // CHECK WITH YOUR SUPPLIER WHAT'S IN THIS.
    // Melatonin is a prescription-only medicine in the UK and cannot be
    // sold as a supplement. Magnesium, glycine, L-theanine and similar
    // are fine. See the note in the README.
    description: "[SUPPLIER DESCRIPTION — list the active ingredients and the amount of each per serving.]",
    badges: [],
    options: { Strength: ["500 mg"] },
    variants: [
      { sku: "SLP-500MG", options: { Strength: "500 mg" }, price: 19.99, stock: 30 }
    ]
  },
  {
    id: "collagen",
    image: "images/products/collagen.jpg",
    name: "Collagen",
    category: "All",
    form: "jar",
    tint: "rgba(240,56,78,.25)",
    short: "Hydrolysed collagen. [X] servings.",
    description: "[SUPPLIER DESCRIPTION — say what type and source, e.g. hydrolysed bovine or marine collagen peptides.]",
    badges: [],
    options: { Strength: ["1000 mg"] },
    variants: [
      { sku: "COL-1000MG", options: { Strength: "1000 mg" }, price: 29.99, stock: 20 }
    ]
  },
  {
    id: "omega-3",
    image: "images/products/omega-3.jpg",
    name: "Omega-3",
    category: "All",
    form: "bottle",
    tint: "rgba(240,56,78,.3)",
    short: "[X] softgels. [X] servings.",
    description: "[SUPPLIER DESCRIPTION — state the EPA and DHA content per serving. EPA and DHA contribute to the normal function of the heart; the beneficial effect is obtained with a daily intake of 250 mg.]",
    badges: [],
    options: { Strength: ["1000 mg"] },
    variants: [
      { sku: "OM3-1000MG", options: { Strength: "1000 mg" }, price: 17.99, stock: 45 }
    ]
  }
];

/* Category navigation is switched off, so this stays empty.
   Leave it here — the code expects the variable to exist. */
window.CATEGORIES = [];
