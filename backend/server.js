const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/expenses", async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC, id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, expense_date } = req.body;
    if (!title || Number(amount) <= 0 || !category || !expense_date) {
      return res.status(400).json({ error: "Valid expense details are required." });
    }

    const [result] = await db.query(
      "INSERT INTO expenses (title, amount, category, expense_date) VALUES (?, ?, ?, ?)",
      [title.trim(), Number(amount), category, expense_date]
    );

    const [rows] = await db.query("SELECT * FROM expenses WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { title, amount, category, expense_date } = req.body;

    const [result] = await db.query(
      "UPDATE expenses SET title=?, amount=?, category=?, expense_date=? WHERE id=?",
      [title.trim(), Number(amount), category, expense_date, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Expense not found." });
    }

    const [rows] = await db.query("SELECT * FROM expenses WHERE id=?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM expenses WHERE id=?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Expense not found." });
    }

    res.json({ message: "Expense deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics/summary", async (_req, res) => {
  try {
    const [[all]] = await db.query(
      "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM expenses"
    );
    const [[month]] = await db.query(
      "SELECT COALESCE(SUM(amount),0) AS monthlyTotal, COUNT(*) AS monthlyCount FROM expenses WHERE DATE_FORMAT(expense_date,'%Y-%m')=DATE_FORMAT(CURDATE(),'%Y-%m')"
    );
    res.json({ ...all, ...month });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics/monthly", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(expense_date, '%Y-%m') AS month,
             ROUND(SUM(amount),2) AS total
      FROM expenses
      GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
      ORDER BY month
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics/categories", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT category, ROUND(SUM(amount),2) AS total
      FROM expenses
      GROUP BY category
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/budgets", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, COALESCE(SUM(e.amount),0) AS spent
      FROM budgets b
      LEFT JOIN expenses e
        ON e.category=b.category
       AND DATE_FORMAT(e.expense_date,'%Y-%m')=b.month
      GROUP BY b.id
      ORDER BY b.month DESC, b.category
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/budgets", async (req, res) => {
  try {
    const { category, amount, month, alert_threshold = 80 } = req.body;

    await db.query(
      `INSERT INTO budgets (category, amount, month, alert_threshold)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE amount=VALUES(amount), alert_threshold=VALUES(alert_threshold)`,
      [category, Number(amount), month, Number(alert_threshold)]
    );

    res.status(201).json({ message: "Budget saved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/budgets/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM budgets WHERE id=?", [req.params.id]);

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Budget not found." });
    }

    res.json({ message: "Budget deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Expense Tracker API running on port ${PORT}`);
});
