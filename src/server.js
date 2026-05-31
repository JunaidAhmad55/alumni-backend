require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({
    success: true,
    message: "Alumni API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(authRoutes);
app.use(jobRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

async function start() {
  const { ok, error } = await testConnection();

  if (!ok) {
    console.error("Database connection failed:", error?.code || error?.message);
    console.error(
      "Start MongoDB first: cd alumni-backend-node && npm run db:up"
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Alumni API running on http://localhost:${PORT}`);
  });
}

start();
