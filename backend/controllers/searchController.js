const { getAllData } = require("../services/researchService");
const { generateSummary } = require("../services/llmService");

exports.search = async (req, res) => {
  try {
    const { disease, query } = req.body;

    const finalQuery = `${disease} ${query}`;

    const data = await getAllData(finalQuery);

    // ✅ SAFE fallback
    const papers = data?.openalex?.slice(0, 2) || [];

    res.json({
      summary: "AI summary not available on cloud. Showing research papers only.",
      papers,
      trials: []
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    // ✅ RETURN SAFE RESPONSE INSTEAD OF 500
    res.json({
      summary: "Unable to fetch data right now. Try again later.",
      papers: []
    });
  }
};