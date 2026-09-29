/* =========================================================
   BATCH CERTIFICATES (COA LIBRARY)
   One entry per tested batch. The certificates page lists these,
   filters them by product and batch, and opens each one in a viewer
   with a link to the PDF.

   The entries below are SAMPLES for the design, flagged sample: true
   and shown with a "Sample" label on the site. Delete them and add
   only real certificates issued by the laboratory that tested the
   batch. Never publish a certificate for testing that didn't happen.

   Fields:
     product  — id from js/products.js
     batch    — batch number exactly as printed on the product label
     tested   — ISO date the lab reported
     expiry   — best-before date for the batch
     lab      — name of the testing laboratory (and accreditation number if it has one)
     method   — methods used, as stated on the certificate
     results  — [[test, specification, result, pass(true|false)]]
     pdf      — path to the certificate PDF in /coa/ (e.g. "coa/WPI-2409A.pdf")
   ========================================================= */
window.COAS = [
  {
    sample: true,
    product: "protein-capsules", batch: "[BATCH-1]", tested: "2026-09-02", expiry: "2028-03-31",
    lab: "[TESTING LABORATORY NAME] · [ACCREDITATION NO.]",
    method: "HPLC (assay), ICP-MS (trace metals), plate count (microbiology)",
    results: [
      ["Assay", "Within specification", "[RESULT]", true],
      ["Moisture", "≤ 0.5%", "[RESULT]", true],
      ["Lead", "≤ 0.5 mg/kg", "[RESULT]", true],
      ["Total viable count", "≤ 10,000 cfu/g", "[RESULT]", true],
      ["Salmonella", "Absent in 25 g", "[RESULT]", true]
    ],
    pdf: ""
  },
  {
    sample: true,
    product: "caffeine", batch: "[BATCH-2]", tested: "2026-07-11", expiry: "2028-01-31",
    lab: "[TESTING LABORATORY NAME] · [ACCREDITATION NO.]",
    method: "HPLC (assay), ICP-MS (trace metals)",
    results: [
      ["Assay", "Within specification", "[RESULT]", true],
      ["Lead", "≤ 0.5 mg/kg", "[RESULT]", true],
      ["Salmonella", "Absent in 25 g", "[RESULT]", true]
    ],
    pdf: ""
  },
  {
    sample: true,
    product: "collagen", batch: "[BATCH-3]", tested: "2026-08-19", expiry: "2029-08-31",
    lab: "[TESTING LABORATORY NAME] · [ACCREDITATION NO.]",
    method: "HPLC (assay and related substances), ICP-MS (trace metals)",
    results: [
      ["Assay", "≥ 99.5%", "[RESULT]", true],
      ["Related substances", "≤ 0.5%", "[RESULT]", true],
      ["Appearance", "Conforms", "[RESULT]", true],
      ["Water content", "≤ 0.5%", "[RESULT]", true],
      ["Lead", "≤ 0.5 mg/kg", "[RESULT]", true]
    ],
    pdf: ""
  }
];
