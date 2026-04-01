import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const app = express();
const port = 3001;

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "survey.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    experience TEXT NOT NULL,
    goals TEXT NOT NULL,
    tools TEXT NOT NULL,
    problem TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/submissions", (req, res) => {
  const { role, experience, goals, tools, problem } = req.body ?? {};

  if (
    typeof role !== "string" ||
    typeof experience !== "string" ||
    !Array.isArray(goals) ||
    !Array.isArray(tools) ||
    typeof problem !== "string"
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const insert = db.prepare(`
    INSERT INTO submissions (role, experience, goals, tools, problem)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    role.trim(),
    experience.trim(),
    JSON.stringify(goals),
    JSON.stringify(tools),
    problem.trim()
  );

  res.status(201).json({
    ok: true,
    id: result.lastInsertRowid
  });
});

app.get("/api/submissions", (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM submissions ORDER BY created_at DESC, id DESC`)
    .all();

  res.json({ rows });
});

app.listen(port, () => {
  console.log(`Survey API listening on http://localhost:${port}`);
  console.log(`SQLite DB: ${dbPath}`);
});