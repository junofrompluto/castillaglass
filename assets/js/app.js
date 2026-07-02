/* ============================================================
   Castilla Glass — front-end app
   - dynamic content (services, gallery, service area)
   - guided AI estimator chatbot (hybrid: guided now, Claude API ready)
   ============================================================ */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     CONFIG — flip aiEnabled to true after deploying api/chat.js
     to a serverless host (Vercel/Netlify) with ANTHROPIC_API_KEY.
     Guided mode works with no key and no backend.
  --------------------------------------------------------- */
  const CONFIG = {
    aiEnabled: false,            // true => free-form Claude API answers
    apiEndpoint: "/api/chat",    // serverless function path
    business: {
      name: "Castilla Glass",
      owner: "Daniel Castilla",
      phone: "305-219-0308",
      phoneHref: "+13052190308",
      email: "Dcastilla89@yahoo.com",
    },
  };

  /* ---------------------------------------------------------
     SERVICES — each drives the gallery card AND the chatbot flow
  --------------------------------------------------------- */
  const SERVICES = [
    {
      id: "windowdoor",
      icon: "🪟",
      title: "Impact windows & doors",
      blurb: "Factory-direct V&V impact windows, sliders, French & entry doors — Miami-Dade NOA, installed by our crews.",
      img: "assets/img/services/windowdoor.jpg",
      base: 650, perSqFt: 55,
      questions: [
        { key: "type", q: "What are we installing?", quick: ["Impact windows", "Sliding glass door", "French doors", "Entry door", "Mixed project"] },
        { key: "count", q: "How many openings?", quick: ["1", "2–4", "5–9", "10+"] },
        { key: "impact", q: "Do you need hurricane-impact rated units? (Recommended in South Florida.)", quick: ["Yes — impact", "No", "Tell me the difference"] },
        { key: "size", q: "Average opening size in inches, width × height (a typical window is about 36 x 60). Estimate is fine.", measure: true },
      ],
    },
    {
      id: "shower",
      icon: "🚿",
      title: "Shower doors & enclosures",
      blurb: "Frameless, semi-frameless and custom enclosures in clear, low-iron or tinted glass.",
      img: "assets/img/services/shower.jpg",
      base: 900, perSqFt: 38,
      questions: [
        { key: "style", q: "Which style are you after?", quick: ["Frameless", "Semi-frameless", "Framed / sliding", "Not sure — advise me"] },
        { key: "size", q: "Roughly the opening size in inches — width × height (standard is about 60 x 72). Estimate is okay.", measure: true },
        { key: "glass", q: "Glass finish preference?", quick: ["Clear", "Low-iron (ultra clear)", "Frosted / obscure", "Tinted"] },
        { key: "hardware", q: "Hardware finish?", quick: ["Chrome", "Matte black", "Brushed nickel", "Gold / brass", "Undecided"] },
      ],
    },
    {
      id: "mirrors",
      icon: "🪞",
      title: "Mirrors & mirror walls",
      blurb: "Custom wall mirrors, gym & studio walls, vanity and beveled mirrors — cut and installed to size.",
      img: "assets/img/services/mirror.jpg",
      base: 220, perSqFt: 16,
      questions: [
        { key: "type", q: "What kind of mirror project?", quick: ["Wall / vanity mirror", "Gym / studio wall", "Beveled / framed", "Closet / door mirror", "Not sure"] },
        { key: "size", q: "Roughly the size in inches — width × height (a typical vanity mirror is about 36 x 30). Estimate is fine.", measure: true },
        { key: "edge", q: "Edge / finish preference?", quick: ["Polished edge", "Beveled edge", "Framed", "Undecided"] },
      ],
    },
    {
      id: "railings",
      icon: "🛡️",
      title: "Glass railings",
      blurb: "Balcony, stair and pool-deck railings — frameless or post systems, code-compliant.",
      img: "assets/img/services/railings.jpg",
      base: 1200, perSqFt: 0, perLinFt: 165,
      questions: [
        { key: "location", q: "Where are the railings going?", quick: ["Balcony / terrace", "Staircase", "Pool deck", "Interior loft", "Commercial"] },
        { key: "system", q: "Preferred system?", quick: ["Frameless (standoff)", "Post & glass", "Top-rail channel", "Not sure"] },
        { key: "length", q: "Approximately how many linear feet of railing? A rough number is great.", measure: true, unit: "linft" },
      ],
    },
    {
      id: "commercial",
      icon: "🏢",
      title: "Commercial & storefront",
      blurb: "Storefronts, office partitions, curtain wall and tenant build-outs on contractor timelines.",
      img: "assets/img/services/commercial.jpg",
      base: 1500, perSqFt: 48,
      questions: [
        { key: "project", q: "What's the commercial scope?", quick: ["Storefront / entrance", "Office partitions", "Curtain wall", "Tenant build-out", "Glass replacement"] },
        { key: "area", q: "Approximate total glass area in square feet? A ballpark helps.", measure: true, unit: "sqft" },
        { key: "timeline", q: "What's your timeline?", quick: ["ASAP", "2–4 weeks", "1–3 months", "Planning stage"] },
      ],
    },
  ];

  const GALLERY = [
    { src: "assets/img/gallery/facade.jpg", cap: "Commercial storefront · Miami", cls: "wide" },
    { src: "assets/img/gallery/shower-frosted.jpg", cap: "Frosted shower enclosure · Coral Gables", cls: "tall" },
    { src: "assets/img/gallery/railing-sunset.jpg", cap: "Frameless rooftop railing · Sunny Isles", cls: "" },
    { src: "assets/img/gallery/window-install.jpg", cap: "Impact window install · Brickell", cls: "" },
    { src: "assets/img/gallery/shower-marble.jpg", cap: "Frameless marble bath · Pinecrest", cls: "" },
    { src: "assets/img/gallery/workers.jpg", cap: "Curtain-wall crew · Downtown", cls: "wide" },
    { src: "assets/img/gallery/baseball.jpg", cap: "Storefront glass install · Miami", cls: "" },
    { src: "assets/img/gallery/van-night.jpg", cap: "Mobile install unit · Miami", cls: "" },
  ];

  const AREAS = [
    "Miami", "Miami Beach", "Coral Gables", "Brickell", "Doral", "Aventura",
    "Sunny Isles", "Key Biscayne", "Hialeah", "Kendall", "Homestead",
    "Fort Lauderdale", "Hollywood", "Pembroke Pines", "Davie", "Boca Raton",
    "Delray Beach", "West Palm Beach", "Wellington", "Jupiter",
  ];

  const REVIEWS = [
    { name: "Marisol R.", city: "Coral Gables", stars: 5, text: "Castilla replaced every window in our house with impact units. Factory-direct pricing beat three other quotes and the crew was spotless. Felt the difference in the noise alone." },
    { name: "Andrés P.", city: "Brickell", stars: 5, text: "Frameless shower enclosure came out flawless — perfectly level, heavy glass, gorgeous hardware. The instant online quote was dead-on with the final price." },
    { name: "Jenna M.", city: "Sunny Isles", stars: 5, text: "Glass railing on our balcony is stunning and rock solid. They handled the permit and the HOA paperwork. Genuinely easy to work with." },
    { name: "Carlos & Vivian", city: "Doral", stars: 5, text: "Whole-home impact windows financed at $0 down. Knowing they make the windows themselves gave us real confidence. NOA docs handed over at the end." },
    { name: "Tara S.", city: "Pinecrest", stars: 5, text: "Custom mirror wall for our home gym — cut perfectly to size and installed in one visit. Professional from quote to cleanup." },
  ];

  const FAQS = [
    { q: "Do you make your own windows?", a: "Yes — Castilla Glass is the installation team for <strong>V&amp;V Windows &amp; Doors</strong>, our family's impact window &amp; door manufacturer in South Florida. You get factory-direct product and pricing, installed by the same family." },
    { q: "Are your impact windows hurricane approved?", a: "Our impact windows and doors carry <strong>Miami-Dade NOA</strong> (Notice of Acceptance) and are rated for high winds and wind-borne debris. We hand over the approval documentation on completion." },
    { q: "What glass work do you install?", a: "Impact windows &amp; doors, frameless and semi-frameless shower enclosures, mirrors &amp; mirror walls, glass railings, and commercial storefronts. We're an <strong>installation</strong> company — we install new glass rather than doing patch repairs." },
    { q: "How accurate is the instant online estimate?", a: "It's a solid ballpark based on the details you provide. We lock in an exact price after a quick, free on-site measure — no obligation." },
    { q: "Do you offer financing?", a: "Yes. Approved financing includes <strong>$0-down</strong> options with terms up to 15 years, plus PACE and traditional lenders. Ask for a monthly payment when you request your quote." },
    { q: "What areas do you serve?", a: "Miami-Dade, Broward and Palm Beach — from Homestead to Jupiter. Check the service-area list below or just ask the estimator." },
  ];

  /* ---------------------------------------------------------
     RENDER static-but-dynamic content
  --------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* teal line icons per service (mockup tile style) */
  const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    windowdoor: `<svg ${SVG_ATTRS}><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
    shower: `<svg ${SVG_ATTRS}><rect x="6" y="3" width="12" height="18" rx="1.5"/><line x1="9" y1="10" x2="9" y2="14"/><path d="M18 3l3 3"/></svg>`,
    mirrors: `<svg ${SVG_ATTRS}><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="8" x2="14" y2="13"/><line x1="9" y1="12" x2="12" y2="15"/></svg>`,
    railings: `<svg ${SVG_ATTRS}><line x1="3" y1="8" x2="21" y2="8"/><line x1="5" y1="8" x2="5" y2="20"/><line x1="12" y1="8" x2="12" y2="20"/><line x1="19" y1="8" x2="19" y2="20"/><line x1="3" y1="20" x2="21" y2="20"/></svg>`,
    commercial: `<svg ${SVG_ATTRS}><path d="M4 9L5.5 4h13L20 9"/><path d="M5 9v11h14V9"/><path d="M9.5 20v-5h5v5"/><path d="M4 9h16"/></svg>`,
  };
  const CHEVRON = `<svg ${SVG_ATTRS}><polyline points="9 6 15 12 9 18"/></svg>`;

  function renderServices() {
    const grid = $("#servicesGrid");
    grid.innerHTML = SERVICES.map((s) => `
      <article class="svc reveal" data-service="${s.id}" role="button" tabindex="0" aria-label="Start estimate for ${s.title}">
        <span class="svc__icon" aria-hidden="true">${ICONS[s.id] || ""}</span>
        <div class="svc__txt">
          <h3>${s.title}</h3>
          <p>${s.blurb}</p>
        </div>
        <span class="svc__go" aria-hidden="true">${CHEVRON}</span>
      </article>`).join("");
  }

  function renderGallery() {
    $("#gallery").innerHTML = GALLERY.map((g) => `
      <figure class="reveal ${g.cls}">
        <img loading="lazy" src="${g.src}" alt="${g.cap}" onerror="this.parentElement.style.background='linear-gradient(135deg,#102834,#2f9fae)'" />
        <figcaption>${g.cap}</figcaption>
      </figure>`).join("");
  }

  function renderAreas() {
    $("#areaChips").innerHTML = AREAS.map((a) => `<span class="area-chip reveal">📍 ${a}</span>`).join("");
  }

  /* ---- testimonials carousel ---- */
  function renderReviews() {
    const track = $("#reviewsTrack");
    const dots = $("#reviewsDots");
    if (!track) return;
    track.innerHTML = REVIEWS.map((r) => `
      <article class="review">
        <div class="review__stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}</div>
        <p class="review__text">“${r.text}”</p>
        <div class="review__by"><strong>${r.name}</strong><span>${r.city} · Google review</span></div>
      </article>`).join("");
    dots.innerHTML = REVIEWS.map((_, i) => `<button class="reviews__dot${i === 0 ? " on" : ""}" data-i="${i}" aria-label="Review ${i + 1}"></button>`).join("");

    let i = 0;
    const cards = $$(".review", track);
    const dotEls = $$(".reviews__dot", dots);
    const go = (n) => {
      i = (n + REVIEWS.length) % REVIEWS.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dotEls.forEach((d, k) => d.classList.toggle("on", k === i));
    };
    dotEls.forEach((d) => d.addEventListener("click", () => { go(+d.dataset.i); restart(); }));
    let timer = setInterval(() => go(i + 1), 5500);
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); };
    void cards;
  }

  /* ---- FAQ accordion ---- */
  function renderFaq() {
    const list = $("#faqList");
    if (!list) return;
    list.innerHTML = FAQS.map((f, i) => `
      <div class="faq-item" data-i="${i}">
        <button class="faq-item__q" aria-expanded="false">${f.q}<span class="faq-item__ic" aria-hidden="true">+</span></button>
        <div class="faq-item__a"><p>${f.a}</p></div>
      </div>`).join("");
    $$(".faq-item__q", list).forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const open = item.classList.contains("open");
        $$(".faq-item", list).forEach((it) => { it.classList.remove("open"); it.querySelector(".faq-item__q").setAttribute("aria-expanded", "false"); });
        if (!open) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
      });
    });
  }

  /* ---- glass weight calculator ---- */
  function initCalc() {
    const form = $("#calcForm");
    if (!form) return;
    const W = $("#calcW"), H = $("#calcH"), T = $("#calcT"), TYPE = $("#calcType"), QTY = $("#calcQty");
    const each = $("#calcEach"), total = $("#calcTotal");
    const DENSITY = 2.5; // g/cm³ soda-lime
    const fmt = (lb) => lb >= 1 ? `${lb.toFixed(1)} lb` : `${(lb * 16).toFixed(1)} oz`;
    const calc = () => {
      const w = parseFloat(W.value) || 0, h = parseFloat(H.value) || 0;
      const tmm = parseFloat(T.value) || 0, mult = parseFloat(TYPE.value) || 1;
      const qty = Math.max(1, parseInt(QTY.value) || 1);
      // convert to cm: 1 in = 2.54 cm; thickness mm → cm
      const areaCm2 = (w * 2.54) * (h * 2.54);
      const volCm3 = areaCm2 * (tmm / 10);
      const grams = volCm3 * DENSITY * mult;
      const lbEach = grams / 453.592;
      each.textContent = w && h ? fmt(lbEach) : "—";
      total.textContent = w && h ? fmt(lbEach * qty) : "—";
    };
    [W, H, T, TYPE, QTY].forEach((el) => el.addEventListener("input", calc));
    form.addEventListener("submit", (e) => e.preventDefault());
    calc();
  }

  /* ---------------------------------------------------------
     UI niceties: nav, reveal, counters, mobile menu, year
  --------------------------------------------------------- */
  function initChrome() {
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $("#burger");
    const links = $(".nav__links");
    burger.addEventListener("click", () => links.classList.toggle("is-open"));
    $$(".nav__links a").forEach((a) => a.addEventListener("click", () => links.classList.remove("is-open")));

    $("#year").textContent = new Date().getFullYear();

    // reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el) => io.observe(el));

    // animated stat counters
    const counters = $$("[data-count]");
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const decimals = target % 1 !== 0;
        let cur = 0;
        const step = target / 60;
        const tick = () => {
          cur += step;
          if (cur >= target) { el.textContent = decimals ? target.toFixed(1) : Math.round(target).toLocaleString(); return; }
          el.textContent = decimals ? cur.toFixed(1) : Math.round(cur).toLocaleString();
          requestAnimationFrame(tick);
        };
        tick();
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  }

  /* =========================================================
     CHATBOT
  ========================================================= */
  const chat = {
    el: $("#chat"),
    body: $("#chatBody"),
    quick: $("#chatQuick"),
    form: $("#chatForm"),
    input: $("#chatText"),
    fab: $("#chatFab"),
    state: null,
    started: false,
  };

  function openChat(presetService) {
    chat.el.classList.add("is-open");
    chat.el.setAttribute("aria-hidden", "false");
    chat.fab.classList.add("is-hidden");
    if (!chat.started) { chat.started = true; startFlow(presetService); }
    else if (presetService) { selectService(presetService); }
    setTimeout(() => chat.input.focus(), 350);
  }
  function closeChat() {
    chat.el.classList.remove("is-open");
    chat.el.setAttribute("aria-hidden", "true");
    chat.fab.classList.remove("is-hidden");
  }

  function botSay(html, opts = {}) {
    return new Promise((resolve) => {
      const typing = document.createElement("div");
      typing.className = "msg msg--bot typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      chat.body.appendChild(typing);
      scrollChat();
      const delay = opts.fast ? 250 : Math.min(900, 350 + html.length * 8);
      setTimeout(() => {
        typing.remove();
        const m = document.createElement("div");
        m.className = "msg msg--bot";
        m.innerHTML = html;
        chat.body.appendChild(m);
        scrollChat();
        resolve();
      }, delay);
    });
  }
  function userSay(text) {
    const m = document.createElement("div");
    m.className = "msg msg--user";
    m.textContent = text;
    chat.body.appendChild(m);
    scrollChat();
  }
  function setQuick(options, handler) {
    chat.quick.innerHTML = "";
    (options || []).forEach((opt) => {
      const b = document.createElement("button");
      b.className = "quick";
      b.type = "button";
      b.textContent = opt;
      b.addEventListener("click", () => { chat.quick.innerHTML = ""; handler(opt); });
      chat.quick.appendChild(b);
    });
  }
  function clearQuick() { chat.quick.innerHTML = ""; }
  function scrollChat() { chat.body.scrollTop = chat.body.scrollHeight; }

  /* ---- conversation flow (state machine) ---- */
  async function startFlow(presetService) {
    chat.body.innerHTML = "";
    chat.state = { stage: "service", service: null, qIndex: 0, answers: {}, contact: {} };
    await botSay(`Hey, I'm the ${CONFIG.business.name} estimator 👋 I'll grab a few quick details and give you a ballpark price on the spot.`);
    if (presetService) { await selectService(presetService); return; }
    await botSay("What kind of glass work do you need?");
    setQuick(SERVICES.map((s) => `${s.icon} ${s.title}`), (label) => {
      const svc = SERVICES.find((s) => label.includes(s.title));
      handleServicePick(svc);
    });
  }

  function selectService(serviceId) {
    const svc = SERVICES.find((s) => s.id === serviceId);
    if (svc) handleServicePick(svc, true);
  }
  async function handleServicePick(svc, echo) {
    if (!svc) return;
    if (chat.state.service) { // already mid-flow; restart cleanly for new pick
      chat.state = { stage: "service", service: null, qIndex: 0, answers: {}, contact: {} };
      chat.body.innerHTML = "";
    }
    if (echo) userSay(`${svc.icon} ${svc.title}`);
    chat.state.service = svc;
    chat.state.stage = "questions";
    chat.state.qIndex = 0;
    await botSay(`Got it — <strong>${svc.title}</strong>. Just a few questions.`, { fast: true });
    askNext();
  }

  async function askNext() {
    const { service, qIndex } = chat.state;
    if (qIndex >= service.questions.length) { askContact(); return; }
    const q = service.questions[qIndex];
    await botSay(q.q);
    if (q.measure) {
      await botSay("📐 Not sure how to measure? Width is side-to-side, height is top-to-bottom. Round to the nearest inch — we confirm exact sizes on site.", { fast: true });
    }
    if (q.quick) setQuick(q.quick, (ans) => acceptAnswer(ans));
    else clearQuick();
  }

  function acceptAnswer(text) {
    const { service, qIndex } = chat.state;
    const q = service.questions[qIndex];
    userSay(text);
    chat.state.answers[q.key] = { label: q.q, value: text, meta: q };
    chat.state.qIndex++;
    askNext();
  }

  /* ---- contact capture ---- */
  const CONTACT_STEPS = [
    { key: "name", q: "Almost done! What's your name?", validate: (v) => v.trim().length > 1 || "Please enter your name." },
    { key: "phone", q: "Best phone number for your quote?", validate: (v) => /[0-9].*[0-9].*[0-9]/.test(v) || "That doesn't look like a phone number." },
    { key: "email", q: "And an email to send the written estimate to?", validate: (v) => /\S+@\S+\.\S+/.test(v) || "Please enter a valid email." },
    { key: "zip", q: "Finally, your ZIP code so I can confirm we serve your area.", quick: ["33139", "33133", "33301", "33141", "Other"], validate: (v) => /\d{4,5}/.test(v) || /other/i.test(v) || "Please enter a ZIP code." },
  ];
  async function askContact() {
    chat.state.stage = "contact";
    chat.state.cIndex = 0;
    await botSay("Perfect. Let me get your estimate ready — just need a way to reach you. 📋", { fast: true });
    askContactNext();
  }
  async function askContactNext() {
    const step = CONTACT_STEPS[chat.state.cIndex];
    if (!step) { finish(); return; }
    await botSay(step.q);
    if (step.quick) setQuick(step.quick, (v) => acceptContact(v));
    else clearQuick();
  }
  function acceptContact(text) {
    const step = CONTACT_STEPS[chat.state.cIndex];
    const res = step.validate ? step.validate(text) : true;
    if (res !== true) { userSay(text); botSay("⚠️ " + res, { fast: true }).then(() => askContactNext()); return; }
    userSay(text);
    chat.state.contact[step.key] = text;
    chat.state.cIndex++;
    askContactNext();
  }

  /* ---- estimate math ---- */
  function parseDims(str) {
    const nums = (str.match(/\d+(\.\d+)?/g) || []).map(Number);
    return nums;
  }
  function estimate() {
    const svc = chat.state.service;
    const a = chat.state.answers;
    let low, high, note = "";
    // find a measurement answer
    let measureQ = svc.questions.find((q) => q.measure);
    let unit = measureQ ? (measureQ.unit || "wh") : null;
    let size = measureQ ? parseDims(a[measureQ.key]?.value || "") : [];

    if (unit === "linft") {
      const lf = size[0] || 20;
      low = svc.base + lf * svc.perLinFt * 0.9;
      high = svc.base + lf * svc.perLinFt * 1.25;
      note = `${lf} linear ft`;
    } else if (unit === "sqft") {
      const sf = size[0] || 100;
      low = svc.base + sf * svc.perSqFt * 0.85;
      high = svc.base + sf * svc.perSqFt * 1.3;
      note = `${sf} sq ft`;
    } else if (unit === "wh" || (size.length >= 2)) {
      const w = size[0] || 36, h = size[1] || 60;
      const sf = (w * h) / 144;
      low = svc.base + sf * svc.perSqFt * 0.85;
      high = svc.base + sf * svc.perSqFt * 1.35;
      note = `${w}″ × ${h}″ (≈${sf.toFixed(1)} sq ft)`;
    } else {
      low = svc.base;
      high = svc.base * 1.8;
      note = "pending field measure";
    }
    // multipliers
    const txt = JSON.stringify(a).toLowerCase();
    if (txt.includes("impact") || txt.includes("urgent") || txt.includes("emergency")) { low *= 1.15; high *= 1.2; }
    if (txt.includes("low-iron") || txt.includes("gold") || txt.includes("curtain wall")) { low *= 1.1; high *= 1.18; }
    if (txt.includes("4+") || txt.includes("10+") || txt.includes("5–9")) { low *= 2.4; high *= 3.2; }
    if (txt.includes("2–4") || txt.includes("2–3")) { low *= 1.8; high *= 2.2; }

    const round = (n) => Math.round(n / 50) * 50;
    return { low: round(low), high: round(high), note };
  }

  async function finish() {
    chat.state.stage = "done";
    clearQuick();
    await botSay("Crunching the numbers… 🔧", { fast: true });
    const est = estimate();
    const svc = chat.state.service;
    const a = chat.state.answers;
    const c = chat.state.contact;

    const rows = Object.values(a).map((x) => {
      const short = x.label.replace(/\?.*$/, "").split("(")[0].trim();
      return `<dt>${escapeHtml(short).slice(0, 38)}</dt><dd>${escapeHtml(x.value)}</dd>`;
    }).join("");

    const summary = document.createElement("div");
    summary.className = "msg msg--summary";
    summary.innerHTML = `
      <h4>${svc.icon} Your ${svc.title} estimate</h4>
      <dl>
        ${rows}
        <dt>Name</dt><dd>${escapeHtml(c.name || "")}</dd>
        <dt>Phone</dt><dd>${escapeHtml(c.phone || "")}</dd>
        <dt>Email</dt><dd>${escapeHtml(c.email || "")}</dd>
        <dt>ZIP</dt><dd>${escapeHtml(c.zip || "")}</dd>
      </dl>
      <div class="est">Estimated: $${est.low.toLocaleString()} – $${est.high.toLocaleString()}<br>
      <span style="font-weight:400;font-size:.8rem;color:var(--muted)">Based on ${est.note}. Final price confirmed after a free field measure.</span></div>`;
    chat.body.appendChild(summary);
    scrollChat();

    await botSay(`That's a ballpark for the work as described. A real estimate gets locked in after a quick (free) on-site measure.`);
    await botSay(`I've prepared your request. Tap below to send it to ${CONFIG.business.owner} directly, or call <a href="tel:${CONFIG.business.phoneHref}" style="color:var(--aqua)">${CONFIG.business.phone}</a> to talk now.`);

    setQuick(["📧 Email my request", "📞 Call now", "🔁 Start over"], (choice) => {
      if (choice.includes("Email")) sendByEmail(est);
      else if (choice.includes("Call")) window.location.href = `tel:${CONFIG.business.phoneHref}`;
      else { chat.started = false; openChatReset(); }
    });

    // If AI mode is enabled, hand the conversation to the API for free-form follow-ups.
    if (CONFIG.aiEnabled) enableFreeform();
  }

  function openChatReset() { chat.started = true; startFlow(); }

  function sendByEmail(est) {
    const svc = chat.state.service;
    const a = chat.state.answers;
    const c = chat.state.contact;
    const lines = [
      `New quote request via website`,
      `Service: ${svc.title}`,
      ``,
      ...Object.values(a).map((x) => `${x.label.replace(/\?.*$/, "").trim()}: ${x.value}`),
      ``,
      `Name: ${c.name}`,
      `Phone: ${c.phone}`,
      `Email: ${c.email}`,
      `ZIP: ${c.zip}`,
      ``,
      `Instant estimate shown: $${est.low.toLocaleString()} – $${est.high.toLocaleString()} (${est.note})`,
    ].join("\n");
    const subject = encodeURIComponent(`Quote request — ${svc.title} (${c.name})`);
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:${CONFIG.business.email}?subject=${subject}&body=${body}`;
    botSay("📨 Opening your email app with everything filled in — just hit send and we'll be in touch shortly. Thank you!", { fast: true });
  }

  /* ---- optional free-form AI mode (hybrid upgrade) ---- */
  async function enableFreeform() {
    $("#aiBadge").textContent = "AI mode";
    chat.freeform = true;
  }
  async function callAI(message) {
    try {
      const res = await fetch(CONFIG.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context: chat.state }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      return data.reply || "Sorry, I didn't catch that — could you rephrase?";
    } catch (e) {
      return "I'm having trouble reaching the AI right now. You can call us at " + CONFIG.business.phone + " and we'll help directly.";
    }
  }

  /* ---- free text submit ---- */
  function onSubmit(e) {
    e.preventDefault();
    const text = chat.input.value.trim();
    if (!text) return;
    chat.input.value = "";

    const st = chat.state;
    if (!st) return;

    if (st.stage === "questions") { acceptAnswer(text); }
    else if (st.stage === "contact") { acceptContact(text); }
    else if (chat.freeform) {
      userSay(text);
      botSay("…", { fast: true });
      callAI(text).then((reply) => {
        chat.body.lastChild.remove();
        botSay(reply);
      });
    } else if (st.stage === "service") {
      // try to match free text to a service
      const lc = text.toLowerCase();
      const svc = SERVICES.find((s) => lc.includes(s.id) || s.title.toLowerCase().split(" ").some((w) => w.length > 3 && lc.includes(w)));
      userSay(text);
      if (svc) handleServicePick(svc);
      else botSay("I can help with impact windows &amp; doors, shower enclosures, mirrors, glass railings, and commercial storefronts. Which is closest?").then(() =>
        setQuick(SERVICES.map((s) => `${s.icon} ${s.title}`), (label) => handleServicePick(SERVICES.find((s) => label.includes(s.title)))));
    } else if (st.stage === "done") {
      userSay(text);
      botSay(`Thanks! ${CONFIG.business.owner} will follow up. For anything urgent, call ${CONFIG.business.phone}.`, { fast: true });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------------------------------------------------
     WIRE everything up
  --------------------------------------------------------- */
  function init() {
    renderServices();
    renderGallery();
    renderAreas();
    renderReviews();
    renderFaq();
    initCalc();
    initChrome();

    chat.fab.addEventListener("click", () => openChat());
    $("#chatClose").addEventListener("click", closeChat);
    chat.form.addEventListener("submit", onSubmit);

    $$("[data-open-quote]").forEach((b) => b.addEventListener("click", () => openChat()));

    // service cards open chat preset to that service
    document.addEventListener("click", (e) => {
      const card = e.target.closest("[data-service]");
      if (card) openChat(card.dataset.service);
    });
    document.addEventListener("keydown", (e) => {
      const card = e.target.closest && e.target.closest("[data-service]");
      if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openChat(card.dataset.service); }
      if (e.key === "Escape" && chat.el.classList.contains("is-open")) closeChat();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
