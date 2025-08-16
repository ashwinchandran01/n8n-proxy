export const config = {
  api: {
    bodyParser: false, // required for streaming form-data (file uploads)
  },
};

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
          "content-type": req.headers["content-type"],
        },
        body: req, // stream raw request (works for JSON + files)
      }
    );

    const text = await n8nResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text }; // fallback if not JSON
    }

    res.setHeader("Access-Control-Allow-Origin", "https://ashwinchandran01.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
