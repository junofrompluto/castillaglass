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
      id: "broken",
      icon: "🚨",
      title: "Broken / emergency glass",
      blurb: "Storm, impact or break-in damage secured fast — same-day board-up available.",
      img: "assets/img/services/broken.jpg",
      base: 240, perSqFt: 22,
      questions: [
        { key: "item", q: "What broke? (e.g., window, sliding door, storefront, table top)", quick: ["Window", "Sliding glass door", "Storefront", "Tabletop / furniture"] },
        { key: "emergency", q: "Is this an active emergency that needs same-day securing?", quick: ["Yes — urgent", "No — can schedule"] },
        { key: "size", q: "Roughly how big is the broken pane? Give width × height in inches (e.g., 36 x 48). A rough guess is fine.", measure: true },
        { key: "pane", q: "Single pane or double/insulated (two layers)?", quick: ["Single pane", "Double / insulated", "Not sure"] },
      ],
    },
    {
      id: "repair",
      icon: "🔧",
      title: "Repair & service",
      blurb: "Foggy seals, stuck rollers, failed hardware, scratched glass — plus 24/7 emergency response.",
      img: "assets/img/services/repair.jpg",
      base: 150, perSqFt: 9,
      questions: [
        { key: "item", q: "What needs repair or service?", quick: ["Foggy / failed seal", "Shower door hardware", "Window won't open", "Scratched glass", "Other"] },
        { key: "count", q: "How many units / openings are affected?", quick: ["1", "2–3", "4+"] },
        { key: "age", q: "Roughly how old is the glass or unit?", quick: ["Under 5 yrs", "5–15 yrs", "15+ yrs / unsure"] },
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
      id: "windowdoor",
      icon: "🪟",
      title: "Window & door installation",
      blurb: "New construction or replacement — impact windows, sliders, French & entry doors.",
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
      id: "commercial",
      icon: "🏢",
      title: "Commercial & storefront",
      blurb: "Storefronts, office partitions, curtain wall and tenant build-outs on contractor timelines.",
      img: "assets/img/services/commercial.jpg",
      base: 1500, perSqFt: 48,
      questions: [
        { key: "project", q: "What's the commercial scope?", quick: ["Storefront / entrance", "Office partitions", "Curtain wall", "Tenant build-out", "Repair / replacement"] },
        { key: "area", q: "Approximate total glass area in square feet? A ballpark helps.", measure: true, unit: "sqft" },
        { key: "timeline", q: "What's your timeline?", quick: ["ASAP / emergency", "2–4 weeks", "1–3 months", "Planning stage"] },
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
    { src: "assets/img/gallery/baseball.jpg", cap: "Emergency storefront response", cls: "" },
    { src: "assets/img/gallery/van-night.jpg", cap: "24/7 mobile glass unit · Miami", cls: "" },
  ];

  const AREAS = [
    "Miami", "Miami Beach", "Coral Gables", "Brickell", "Doral", "Aventura",
    "Sunny Isles", "Key Biscayne", "Hialeah", "Kendall", "Homestead",
    "Fort Lauderdale", "Hollywood", "Pembroke Pines", "Davie", "Boca Raton",
    "Delray Beach", "West Palm Beach", "Wellington", "Jupiter",
  ];

  /* ---------------------------------------------------------
     RENDER static-but-dynamic content
  --------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function renderServices() {
    const grid = $("#servicesGrid");
    grid.innerHTML = SERVICES.map((s) => `
      <article class="poster reveal" data-service="${s.id}" role="button" tabindex="0" aria-label="Start estimate for ${s.title}">
        <img loading="lazy" src="${s.img}" alt="${s.title} — Castilla Glass" onerror="this.closest('.poster').style.background='linear-gradient(135deg,#10314f,#2e95cb)'" />
        <div class="poster__cta"><span>Start estimate →</span></div>
      </article>`).join("");
  }

  function renderGallery() {
    $("#gallery").innerHTML = GALLERY.map((g) => `
      <figure class="reveal ${g.cls}">
        <img loading="lazy" src="${g.src}" alt="${g.cap}" onerror="this.parentElement.style.background='linear-gradient(135deg,#10314f,#2e95cb)'" />
        <figcaption>${g.cap}</figcaption>
      </figure>`).join("");
  }

  function renderAreas() {
    $("#areaChips").innerHTML = AREAS.map((a) => `<span class="area-chip reveal">📍 ${a}</span>`).join("");
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
      else botSay("I can help with broken glass, repairs, shower doors, railings, window/door installs, and commercial work. Which is closest?").then(() =>
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
