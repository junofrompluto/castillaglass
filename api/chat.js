/**
 * Castilla Glass — optional AI chat backend (serverless function)
 * ----------------------------------------------------------------
 * This is the OPTIONAL upgrade path for the website's chatbot.
 *
 * The site ships in "guided mode" — the estimator in assets/js/app.js
 * runs entirely in the browser with NO backend and NO API key. That
 * mode captures the job type, measurements, photos and contact info,
 * and produces an instant estimate. It works on GitHub Pages as-is.
 *
 * To enable FREE-FORM AI answers (the "hybrid" upgrade):
 *   1. Deploy this project to a host that runs serverless functions
 *      (Vercel or Netlify — GitHub Pages alone cannot run this file).
 *   2. Set an environment variable:  ANTHROPIC_API_KEY=sk-ant-...
 *   3. In assets/js/app.js set CONFIG.aiEnabled = true.
 *
 * This handler is written for Vercel (export default). For Netlify,
 * rename to netlify/functions/chat.js and adapt the signature.
 *
 * Model: claude-sonnet-4-6 (fast, low-cost, great for chat).
 */

const SYSTEM_PROMPT = `You are the estimator assistant for Castilla Glass, a glass
installation and repair company serving South Florida (Miami-Dade, Broward,
Palm Beach). Owner: Daniel Castilla. Phone: 305-219-0308. Email: Dcastilla89@yahoo.com.

Your job is to EXPEDITE QUOTING. Be warm, concise, and professional. You handle:
- Broken / emergency glass (offer same-day board-up)
- Repair & service (foggy seals, hardware, scratches)
- Shower doors & enclosures (frameless, semi-frameless, framed)
- Glass railings (balcony, stair, pool deck)
- Window & door installation (impact windows, sliders, French/entry doors)
- Commercial & storefront work

Always gather: job type, measurements (width x height, or linear/sq ft),
glass/finish preferences, location/ZIP, and the customer's name, phone, email.
Coach customers on how to measure if unsure. Give honest ballpark ranges and
note that the final price is confirmed after a free on-site measure. Recommend
hurricane-impact glass where relevant. Never invent firm prices for complex
commercial work — collect details and promise a fast human follow-up.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
    return;
  }

  try {
    const { message, history = [] } = req.body || {};
    const messages = [
      ...history,
      { role: "user", content: String(message || "").slice(0, 2000) },
    ];

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      res.status(502).json({ error: "Upstream error", detail });
      return;
    }

    const data = await resp.json();
    const reply = (data.content || []).map((b) => b.text).join("").trim();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
