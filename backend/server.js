const express = require("express");
const cors = require("cors");
require("dotenv").config();

const searchRoutes = require("./routes/searchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api", searchRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});