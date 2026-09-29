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
    name: "GLP-3RT",
    category: "All",
    form: "Vial",
    tint: "rgba(216,20,44,.45)",
    short: "Molecular formula - C₂₂₁H₃₄₂N₅₆O₆₈.",
    description: "GLP-3RT is a synthetic peptide that acts as a triple agonist, targeting the Glucagon-like peptide-1 (GLP-1), Glucose-dependent insulinotropic polypeptide (GIP), and Glucagon (GCG) receptors. In laboratory research, it is utilized to study the potentiation of metabolic signaling and the regulation of nutrient-stimulated hormone secretion. Studies focus on its efficacy in modulating glucose homeostasis and observing the synergistic effects of triple-receptor activation on lipid metabolism in experimental models.",
    badges: ["Best seller"],
    options: { Strength: ["10 mg", "20 mg", "30 mg"] },
    variants: [
      { sku: "CRE-1000MG", options: { Strength: "10 mg" }, price: 59.99, stock: 40, image: "images/products/creatine-1000mg.jpg" },
      { sku: "CRE-3000MG", options: { Strength: "20 mg" }, price: 109.99, stock: 30, image: "images/products/creatine-3000mg.jpg" },
      { sku: "CRE-5000MG", options: { Strength: "30 mg" }, price: 159.99, stock: 20, image: "images/products/creatine-5000mg.jpg" }
    ]
  },
  {
    id: "protein-capsules",
    image: "images/products/protein-capsules.jpg",
    name: "Tesamorelin",
    category: "All",
    form: "vial",
    tint: "rgba(216,20,44,.3)",
    short: "Molecular formula - C₂₂₁H₃₆₆N₇₂O₆₇S.",
    description: "TESAMORELIN is a stabilized analog of Growth Hormone-Releasing Factor (GRF). Research applications involve the study of its selective action on growth hormone secretion and its impact on visceral adipose tissue metabolism. It is frequently used to observe the regulation of the IGF-1 axis and the lipolytic response in metabolic syndrome laboratory models..",
    badges: ["Best seller"],
    options: { Strength: ["10 mg", "20 mg"] },
    variants: [
      { sku: "PRO-500MG",  options: { Strength: "10 mg" },  price: 69.99, stock: 40, image: "images/products/protein-capsules-500mg.jpg" },
      { sku: "PRO-1000MG", options: { Strength: "20 mg" }, price: 129.99, stock: 25, image: "images/products/protein-capsules-1000mg.jpg" }
    ]
  },
  {
    id: "caffeine",
    image: "images/products/caffeine.jpg",
    name: "Wolverine Stack",
    category: "All",
    form: "Vial",
    tint: "rgba(240,56,78,.35)",
    short: "Molecular formula - Variable (BPC-157 / TB-500 Complex)",
    // High-caffeine products must carry the statutory warning on the label:
    // "High caffeine content. Not recommended for children or pregnant or
    // breast-feeding women", with the amount in mg per serving.
    description: "The Wolverine Blend is a high-concentration research complex combining Pentadecapeptide BPC-157 and Thymosin Beta-4 (TB-500). This formulation is designed to study the synergistic interaction between angiogenic signaling and actin-sequestering pathways. Researchers utilise this blend to observe accelerated cellular migration and the structural repair of musculoskeletal tissue models in vitro.",
    badges: [],
    options: { Strength: ["10/10 mg"] },
    variants: [
      { sku: "CAF-200MG", options: { Strength: "10/10 mg" }, price: 39.99, stock: 50 }
    ]
  },
  {
    id: "electrolyte",
    image: "images/products/electrolyte.jpg",
    name: "GHK-CU",
    category: "All",
    form: "vial",
    tint: "rgba(200,200,210,.35)",
    short: "Molecular formula - C14H22N6O4Cu.",
    description: "GHK-Cu is the tripeptide glycyl-L-histidyl-L-lysine in complex with copper(II). In laboratory settings it is studied as a copper-binding ligand, with research focusing on extracellular matrix remodelling, collagen and metalloproteinase expression, and antioxidant signalling in fibroblast models.",
    badges: ["New"],
    options: { Strength: ["100 mg"] },
    variants: [
      { sku: "ELE-1000MG", options: { Strength: "100 mg" }, price: 39.99, stock: 30 }
    ]
  },
  {
    id: "vitamin",
    image: "images/products/vitamin.jpg",
    name: "MOTS-C",
    category: "All",
    form: "Vial",
    tint: "rgba(216,20,44,.25)",
    short: "Molecular formula - C₁₀₁H₁₅₂N₂₈O₂₂S₂.",
    // Vitamins and minerals have legal maximum levels and must show the
    // % NRV per serving on the label. Take these from your supplier.
    description: "MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a 16-amino acid peptide encoded by the mitochondrial genome rather than the cell nucleus. In laboratory settings, it is studied as a mitokine that facilitates mitochondrial-nuclear communication. Research primarily explores its role in activating the AMPK pathway, modulating the folate-methionine cycle, and its influence on metabolic homeostasis and cellular stress resistance in various animal and in vitro models.",
    badges: [],
    options: { Strength: ["10 mg"] },
    variants: [
      { sku: "VIT-1000MG", options: { Strength: "10 mg" }, price: 39.99, stock: 50 }
    ]
  },
  {
    id: "sleep",
    image: "images/products/sleep.jpg",
    name: "Melatonin 2",
    category: "All",
    form: "Vial",
    tint: "rgba(120,120,130,.35)",
    short: "",
    // CHECK WITH YOUR SUPPLIER WHAT'S IN THIS.
    // Melatonin is a prescription-only medicine in the UK and cannot be
    // sold as a supplement. Magnesium, glycine, L-theanine and similar
    // are fine. See the note in the README.
    description: "MT-2 is a cyclic lactam analogue of alpha-melanocyte-stimulating hormone and a non-selective melanocortin receptor ligand. In laboratory settings research examines its activity across the MC1R, MC3R and MC4R subtypes and the cyclic AMP signalling that follows receptor binding.",
    badges: [],
    options: { Strength: ["10 mg"] },
    variants: [
      { sku: "SLP-500MG", options: { Strength: "10 mg" }, price: 39.99, stock: 30 }
    ]
  },
  {
    id: "collagen",
    image: "images/products/collagen.jpg",
    name: "NAD+",
    category: "All",
    form: "Vial",
    tint: "rgba(240,56,78,.25)",
    short: "Molecular formula - C21H27N7O14P2.",
    description: "NAD+ is nicotinamide adenine dinucleotide, a coenzyme present in every living cell and central to redox reactions. In laboratory settings research examines its role as a substrate for sirtuins and PARP enzymes, and its influence on mitochondrial function and cellular energy metabolism in in vitro models.",
    badges: [],
    options: { Strength: ["1000 mg"] },
    variants: [
      { sku: "COL-1000MG", options: { Strength: "1000 mg" }, price: 59.99, stock: 20 }
    ]
  },
  {
    id: "Omega-3",
    image: "images/products/omega-3.jpg",
    name: "Bacteriostatic Water",
    category: "All",
    form: "Vial",
    tint: "rgba(240,56,78,.3)",
    short: "",
    description: "Bacteriostatic water is sterile water containing benzyl alcohol as a bacteriostatic preservative, measured at 0.91% on the current lot. It is used in the laboratory to reconstitute lyophilized material for in vitro work, and the preservative allows a reconstituted vial to be drawn from more than once.",
    badges: [],
    options: { Strength: ["10 ml"] },
    variants: [
      { sku: "OM3-1000MG", options: { Strength: "10 ml" }, price: 15.00, stock: 45 }
    ]
  }
];

/* Category navigation is switched off, so this stays empty.
   Leave it here — the code expects the variable to exist. */
window.CATEGORIES = [];
