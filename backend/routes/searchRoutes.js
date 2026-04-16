const express = require("express");
const router = express.Router();

// ✅ TEST ROUTE
router.get("/search", (req, res) => {
  res.send("API WORKING ✅");
});

// ✅ MAIN ROUTE
router.post("/search", async (req, res) => {
  try {
    const { disease, query } = req.body;

    const papers = [
      { title: "Cancer Treatment Study", publication_year: 2024 },
      { title: "Medical Research Paper", publication_year: 2023 }
    ];

    res.json({
      summary: `Research on ${disease} and ${query} is progressing well.`,
      papers
    });

  } catch (error) {
    res.json({
      summary: "Safe mode response",
      papers: []
    });
  }
});

module.exports = router;