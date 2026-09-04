const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL TERMS for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM terms WHERE user_id = ?`, [
      req.params.userId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one term by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM terms WHERE id = ?`, [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Term not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST (CREATE) new term
router.post("/", async (req, res) => {
  try {
    const { user_id, term_name, start_date, end_date } = req.body;
    const [result] = await db.query(
      `INSERT INTO terms (user_id, term_name, start_date, end_date)
        VALUES (?, ?, ?, ?)`,
      [user_id, term_name, start_date, end_date],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT (UPDATE) a term by ID
router.put("/:id", async (req, res) => {
  try {
    const { term_name, start_date, end_date } = req.body;
    await db.query(
      `UPDATE terms SET term_name=?, start_date=?, end_date=? WHERE id=?`,
      [term_name, start_date, end_date, req.params.id],
    );
    res.json({ message: "Term updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE a term by ID

router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM terms WHERE id = ?`, [req.params.id]);
    res.json({ message: "Term Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
