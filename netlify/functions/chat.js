/**
 * Castilla Glass — Netlify serverless function for the AI chatbot.
 * Routed from /api/chat via netlify.toml.
 *
 * To enable free-form AI chat:
 *   1. In Netlify: Site settings → Environment variables → add
 *        ANTHROPIC_API_KEY = sk-ant-...
 *   2. In assets/js/app.js set CONFIG.aiEnabled = true.
 *
 * Without these, the site runs in guided mode and never calls this.
 * Model: claude-sonnet-4-6
 */

const SYSTEM_PROMPT = `You are the estimator assistant for Castilla Glass, a glass
installation and repair company serving South Florida (Miami-Dade, Broward,
Palm Beach). Owner: Daniel Castilla. Phone: 305-219-0308. Email: Dcastilla89@yahoo.com.

Your job is to EXPEDITE QUOTING. Be warm, concise, and professional. You handle:
broken/emergency glass (offer same-day board-up), repair & service, shower doors
& enclosures, glass railings, window & door installation (impact windows, sliders,
French/entry doors), and commercial & storefront work.

Always gather: job type, measurements, glass/finish preferences, location/ZIP, and
the customer's name, phone, email. Coach customers on measuring if unsure. Give
honest ballpark ranges and note the final price is confirmed after a free on-site
measure. Recommend hurricane-impact glass where relevant.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }) };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body || "{}");
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
      return { statusCode: 502, body: JSON.stringify({ error: "Upstream error", detail }) };
    }

    const data = await resp.json();
    const reply = (data.content || []).map((b) => b.text).join("").trim();
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
