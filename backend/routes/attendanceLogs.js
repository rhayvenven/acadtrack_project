const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all attendance logs for a specific subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM attendance_logs WHERE subject_id = ?",
      [req.params.subjectId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one attendance log by its own id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM attendance_logs WHERE id = ?",
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Attendance log not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new attendance log
router.post("/", async (req, res) => {
  try {
    const { subject_id, date, present } = req.body;
    const [result] = await db.query(
      `INSERT INTO attendance_logs (subject_id, date, present)
       VALUES (?, ?, ?)`,
      [subject_id, date, present],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update) an attendance log
router.put("/:id", async (req, res) => {
  try {
    const { date, present } = req.body;
    await db.query(
      `UPDATE attendance_logs SET date = ?, present = ?
       WHERE id = ?`,
      [date, present, req.params.id],
    );
    res.json({ message: "Attendance log updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an attendance log
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM attendance_logs WHERE id = ?", [req.params.id]);
    res.json({ message: "Attendance log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
