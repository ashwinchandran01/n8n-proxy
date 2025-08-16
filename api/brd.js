export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://ashwinchandran01.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const n8nResponse = await fetch(
      "https://n8n.delivery-pre-uat.gocomet.com/webhook/e24fafe0-14a1-4c59-9c93-0077bd1684ce",
      {
        method: "POST",
        headers: {
          ...req.headers,
          host: undefined, // avoid host header conflicts
        },
        body: req, // for simple JSON; for file uploads we'll tweak
      }
    );

    const data = await n8nResponse.json();

    res.setHeader("Access-Control-Allow-Origin", "https://ashwinchandran01.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
