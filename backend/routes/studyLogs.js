const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all study logs for a specific subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM study_logs WHERE subject_id = ?",
      [req.params.subjectId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one study log by its own id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM study_logs WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Study log not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new study log
router.post("/", async (req, res) => {
  try {
    const { subject_id, date, hours_studied } = req.body;
    const [result] = await db.query(
      `INSERT INTO study_logs (subject_id, date, hours_studied)
       VALUES (?, ?, ?)`,
      [subject_id, date, hours_studied],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) a study log
router.put("/:id", async (req, res) => {
  try {
    const { date, hours_studied } = req.body;
    await db.query(
      `UPDATE study_logs SET date = ?, hours_studied = ?
       WHERE id = ?`,
      [date, hours_studied, req.params.id],
    );
    res.json({ message: "Study log updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a study log
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM study_logs WHERE id = ?", [req.params.id]);
    res.json({ message: "Study log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
