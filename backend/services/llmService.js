const axios = require("axios");

// 🔹 Convert OpenAlex abstract index → readable text
function parseAbstract(index) {
  if (!index) return "";

  const words = [];

  Object.entries(index).forEach(([word, positions]) => {
    positions.forEach(pos => {
      words[pos] = word;
    });
  });

  return words.join(" ");
}

// 🔹 Generate summary using Ollama
async function generateSummary(data) {
  try {
    // ✅ Take only 2 papers (fast + stable)
    const papers = data.openalex.slice(0, 2);

    // ✅ Prepare clean input text
    const cleanText = papers.map(p => {
      const abstractText = parseAbstract(p.abstract_inverted_index);

      return `
Title: ${p.title}
Abstract: ${abstractText.substring(0, 300)}
      `;
    }).join("\n\n");

    // ✅ Call Ollama
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi",
      prompt: `
You are a medical assistant.

Return ONLY this format:

1. Treatment: <one short sentence>
2. Key Findings: <one short sentence>
3. Latest Advancements: <one short sentence>

STRICT RULES:
- Max 3 lines only
- No extra text
- No explanation
- No examples
- No notes
- Stop after point 3

Data:
${cleanText}
      `,
      stream: false
    });

    const raw = response.data.response;

    console.log("RAW LLM 👉", raw);

    // 🔥 CLEAN OUTPUT (remove extra junk safely)
    let cleaned = raw;

    if (raw.includes("3. Latest Advancements:")) {
      const parts = raw.split("3. Latest Advancements:");
      const lastLine = parts[1].split("\n")[0];

      cleaned =
        parts[0] +
        "3. Latest Advancements:" +
        lastLine;
    }

    return cleaned.trim();

  } catch (error) {
    console.log("LLM ERROR:", error.message);
    return "Summary not available";
  }
}

module.exports = { generateSummary };