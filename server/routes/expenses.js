import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req, res) => {
  const { title, amount, category } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, category) VALUES ($1,$2,$3) RETURNING *",
      [title, amount, category]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

export default router;