const axios = require("axios");

// 🔹 OpenAlex
async function fetchOpenAlex(query) {
  const url = `https://api.openalex.org/works?search=${query}`;
  const res = await axios.get(url);
  return res.data.results;
}

// 🔹 PubMed
async function fetchPubMed(query) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=json`;
  const res = await axios.get(url);
  return res.data;
}

// 🔹 Ranking (IMPORTANT)
function rankPapers(papers) {
  return papers
    .filter(p => p.publication_year)
    .sort((a, b) => b.publication_year - a.publication_year)
    .slice(0, 6);
}

// 🔹 Combine all
async function getAllData(query) {
  let openalex = [];
  let pubmed = {};

  try {
    openalex = await fetchOpenAlex(query);
  } catch (err) {
    console.log("OpenAlex Error:", err.message);
    openalex = [];
  }

  try {
    pubmed = await fetchPubMed(query);
  } catch (err) {
    console.log("PubMed Error:", err.message);
    pubmed = {};
  }

  const ranked = rankPapers(openalex);

  return {
    openalex: ranked,
    pubmed,
    trials: []
  };
}

module.exports = {
  fetchOpenAlex,
  fetchPubMed,
  getAllData
};