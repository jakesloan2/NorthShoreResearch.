/* =========================================================
   SITE CONFIG — the only file you should need to edit to
   rebrand, change shipping rules or wire up payments.
   Anything in [SQUARE BRACKETS] is a placeholder.
   ========================================================= */
window.SITE = {
  name: "North Shore",                             // check Companies House, trade marks and domain before launch
  tagline: "Research",
  legalName: "[COMPANY LEGAL NAME LTD]",
  companyNumber: "[COMPANY NUMBER]",
  vatNumber: "[VAT NUMBER]",
  address: "[REGISTERED ADDRESS]",
  email: "[hello@yourdomain.co.uk]",
  phone: "[+44 (0)000 000 0000]",
  currency: "GBP",
  locale: "en-GB",
  announce: "Free UK delivery on orders over £200",

  /* The assurance panel on every product page.
     stats  — up to three: icon, the bold line, the small caption
     checks — pass/fail rows shown as green or grey pills
     icon can be: flask | search | truck | shield | check | pin | return | leaf
     A product can override this with its own "assurance" block in products.js.
     Only state results you actually hold a certificate for. */
  assurance: {
    stats: [
      { icon: "flask",  value: "Lab tested",   label: "Independent UK lab" },
      { icon: "search", value: "[PURITY]%",    label: "HPLC verified" },
      { icon: "truck",  value: "Tracked",      label: "Shipped from the UK" }
    ],
    checks: [
      { label: "Identity & purity", pass: true },
      { label: "Batch certificate published", pass: true }
    ]
  },

  /* Asked at the end of checkout, before the order is placed.
     "Please choose" stays as the unselected state, so the customer has
     to make a choice. Add or rename options freely — whatever is picked
     is sent to your backend with the order as "buyerType".
     Set required: false to make it optional, or remove the whole block
     to drop the question entirely. */
  buyerTypes: {
    heading: "About you",
    label: "Are you buying as",
    required: true,
    options: ["Personal", "Gym owner", "Distributor"],
    // Options that reveal an optional business name field
    businessOptions: ["Gym owner", "Distributor"],
    note: "Trade customers: tell us your business name and we'll be in touch about trade pricing."
  },

  /* Show the SKU under the product name on a product page?
     Hidden unless this is exactly true, so customers only see the
     product name. The SKU keeps working behind the scenes either way. */
  showSku: false,

  /* Footer text — edit to match what you actually sell. */
  footerBlurb: "Placeholder footer text. Replace with a line about your business.",
  footerNote: "",                                  // small print under the footer; leave "" to hide

  /* Service promises shown on the site. Only state what is true for
     your business — these appear as facts to customers. */
  promises: {
    dispatch: "Orders before 2pm dispatched same working day",
    returns: "30-day returns on unopened items",
    returnsDays: 30,
    testing: "Batch certificates published for tested products"
  },

  // Shipping — edit freely. Prices in GBP.
  shipping: {
    freeThreshold: 200,
    options: [
      { id: "standard", label: "Standard tracked", eta: "2–3 working days", price: 3.95 },
      { id: "express",  label: "Express tracked",  eta: "Next working day",  price: 6.95 }
    ]
  },

  /* Age verification (see js/age-gate.js). Not a legal requirement for
     ordinary food supplements; useful if you stock high-caffeine
     products that are labelled as not recommended for under-18s. */
  ageGate: {
    enabled: true,
    minAge: 18,
    rememberDays: 30,
    exitUrl: "https://www.google.co.uk/"
  },

  /* First-order offer pop-up (like the reference site's "15% off your
     first order"). endpoint: where sign-ups are POSTed as JSON — e.g. a
     Klaviyo/Mailchimp/Formspree form endpoint. Leave "" to test locally:
     the code is revealed but the email isn't sent anywhere. */
  welcomeOffer: {
    enabled: true,
    code: "WELCOME10",
    headline: "10% off your first order",
    delaySeconds: 8,
    endpoint: ""
  },

  // Floating WhatsApp button (both reference sites have one). International format, digits only. "" hides it.
  whatsapp: "447000000000",

  // Payment handoff. The static site never handles card details.
  // mode: "demo"    → shows the confirmation page locally (for testing the design)
  //       "shopify" → sends the basket, code and address to Shopify's hosted checkout (recommended)
  //       "stripe"  → POSTs the order to `endpoint` (a serverless function you host)
  //                    which creates a Stripe Checkout Session and returns { url }
  payment: {
    mode: "demo",
    shopifyDomain: "your-store.myshopify.com",
    endpoint: "https://YOUR-FUNCTION-URL/create-checkout-session",

    /* The options shown under "Payment Options" at checkout.
       id       — sent to your backend so it knows which rail to use
       label    — what the customer sees
       blurb    — optional line underneath
       choices  — optional sub-options (radio buttons inside the card)
       discount — optional % off, applied to this order only
       icon     — optional: "bitcoin"
       Remove a method from this list to switch it off. */
    methods: [
      {
        id: "fena",
        label: "Pay with Fena",
        blurb: "Pay via Fena using your bank, card, or all-in-one checkout.",
        choices: ["Pay by Bank", "Card", "All-in-one checkout"],
        default: true
      },
      {
        id: "bitcoin",
        label: "Bitcoin",
        offer: "20% off your first Bitcoin order",
        discount: 20,
        icon: "bitcoin",
        blurb: "You'll get a Bitcoin address and the amount to send after you place the order. Payment is confirmed on the blockchain, usually within the hour."
      }
    ],

    /* true  = a discount code and a payment discount can both apply
       false = the payment discount is ignored when a code is in use */
    stackDiscounts: false
  },

  // Analytics IDs are only loaded after cookie consent (see cookies.js)
  analytics: { ga4: "" }
};
