import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", api: "express" });
});

app.get("/api/analytics", (req, res) => {
  res.json({ provider: "built-in", enabled: true });
});

app.listen(port, () => {
  console.log(`Express API listening on http://localhost:${port}`);
});
