// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM expenses ORDER BY created_at DESC"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// router.post("/", async (req, res) => {
//   const { title, amount, category } = req.body;

//   try {
//     const result = await pool.query(
//       "INSERT INTO expenses (title, amount, category) VALUES ($1,$2,$3) RETURNING *",
//       [title, amount, category]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Insert failed" });
//   }
// });

// export default router;

import express from "express";
import pool from "../db.js"; // <-- fixed
const router = express.Router();

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// ADD expense
router.post("/", async (req, res) => {
  const { title, amount, category } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, category) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// EDIT expense
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;
  try {
    const result = await pool.query(
      "UPDATE expenses SET title=$1, amount=$2, category=$3 WHERE id=$4 RETURNING *",
      [title, amount, category, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM expenses WHERE id=$1", [id]);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// ANALYTICS: sum per category
router.get("/analytics/category", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;