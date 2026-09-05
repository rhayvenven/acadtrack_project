const express = require("express");
const router = express.Router();
const db = require("../config/db");

//GET ALL subjects for a specific term
router.get("/term/:termId", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM subjects WHERE term_id = ?`, [
      req.params.termId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET all subjects for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM subjects WHERE user_id = ?`, [
      req.params.userId,
    ]);
    res.json(rows);
  } catch {
    res.status(500).json({ error: err.message });
  }
});

// GET one subject by user Id
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.query(`SELECT FROM * subject WHERE id = ?`, [
      req.params.id,
    ]);
    if (row === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(row[0]);
  } catch {
    res.status.json(500)({ error: err.message });
  }
});

//POST a new subject
router.post("/", async (req, res) => {
  try {
    const { user_id, term_id, subject_name, units, professor } = req.body;
    const [result] = await db.query(
      `INSERT INTO subjects (user_id, term_id, subject_name, units, professor)
            VALUES (?, ?, ?, ?, ?)`,
      [user_id, term_id, subject_name, units, professor],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (UPDATE) a subject
router.put("/:id", async (req, res) => {
  try {
    const { subject_name, units, professor } = req.body;
    await db.query(
      `UPDATE subjects SET subject_name = ?, units = ?, professor = ? WHERE id = ?`,
      [subject_name, units, professor, req.params.id],
    );
    res.json(201).json({ message: "Subject Updated!" });
  } catch (err) {
    req.status(500).json({ error: err.message });
  }
});

//DELETE a subject
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM subjects WHERE = ?`, [req.params.id]);
    res.json({ message: "Subject Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
