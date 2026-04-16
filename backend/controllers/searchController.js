const { getAllData } = require("../services/researchService");
const { generateSummary } = require("../services/llmService");

exports.search = async (req, res) => {
  try {
    const { disease, query } = req.body;

    const finalQuery = `${disease} ${query}`;

    const data = await getAllData(finalQuery);

    const summary = "AI summary not available on cloud. Showing research papers only.";

    res.json({
      summary,
      papers: data.openalex.slice(0, 2),
      trials: []
    });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};