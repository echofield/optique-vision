import Anthropic from "@anthropic-ai/sdk";

// Server-side only — ANTHROPIC_API_KEY never reaches the browser.
// Generates the plain-language audiology report ("compte rendu") for a client
// from their audiogram, in the maison's warm voice. Falls back to seed copy
// client-side if this route errors or no key is configured.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    paragraphs: { type: "array", items: { type: "string" } },
  },
  required: ["paragraphs"],
};

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no_key" }, { status: 503 });
  }
  let body;
  try { body = await req.json(); } catch { body = {}; }
  const { name = "le patient", motif = "bilan auditif", freqs = [], right = [], left = [] } = body;

  const audiogram = (freqs || []).map((f, i) => `${f} Hz : oreille droite ${right[i]} dB, oreille gauche ${left[i]} dB`).join(" · ");

  const client = new Anthropic();
  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system:
        "Tu rédiges le compte rendu d'un bilan auditif pour un patient, au nom d'une maison d'optique et d'audition française haut de gamme (Faubourg Saint-Martin). " +
        "Voix : chaleureuse, humaine, rassurante, sans jargon technique ni chiffres. Vouvoiement. Phrases claires et courtes. " +
        "Adresse-toi au patient avec la civilité appropriée (Monsieur/Madame) déduite de son prénom. " +
        "Explique en mots simples ce que l'audiogramme révèle (par ex. une oreille qui perçoit moins finement les sons aigus), relie-le à la gêne décrite, rassure sur le caractère fréquent et corrigeable, propose un essai sans engagement en conditions réelles, et clôture au nom de l'équipe avec un prochain rendez-vous. " +
        "Rends exactement 6 paragraphes. Le premier est une salutation (« Bonjour Monsieur X, » / « Bonjour Madame X, »). N'invente aucune donnée médicale au-delà de ce qui est fourni.",
      messages: [
        {
          role: "user",
          content:
            `Patient : ${name}\nMotif : ${motif}\nAudiogramme (seuils, plus le chiffre est haut moins l'oreille perçoit) : ${audiogram || "non communiqué"}\n\nRédige le compte rendu en 6 paragraphes.`,
        },
      ],
    });

    const text = (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(text);
    const paragraphs = Array.isArray(parsed.paragraphs) ? parsed.paragraphs.filter((p) => typeof p === "string" && p.trim()) : [];
    if (!paragraphs.length) return Response.json({ error: "empty" }, { status: 502 });
    return Response.json({ paragraphs });
  } catch (e) {
    return Response.json({ error: "generation_failed", detail: String(e && e.message || e) }, { status: 502 });
  }
}
