const express = require("express");
const router = express.Router();
const db = require("../config/db");

//GET ALL grades
router.get("/assessment/:assessmentTypeId", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM grades WHERE id = ?`, [
      req.params.assessmentTypeId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one grade using id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM grades WHERE id = ?`, [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Grade not found" });
    }
    res.json(row[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST a new grade
router.post("/", async (req, res) => {
  try {
    const { assessment_type_id, raw_score, max_score, date_taken } = req.body;
    const [result] = await db.query(
      `INSERT INTO grades (assessment_type_id, raw_score, max_score, date_taken) 
        VALUES (?, ?, ?, ?)`,
      [assessment_type_id, raw_score, max_score, date_taken],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT (UPDATE) a grade
router.put("/:id", async (req, res) => {
  try {
    const { raw_score, max_score, date_taken } = req.body;
    await db.query(
      `UPDATE grades SET raw_score = ?, max_score = ?, date_taken = ? WHERE id = ?`,
      [req.params.id],
    );
    res.json({ message: "Grade Updated Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE a grade
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM grades WHERE id = ?`, [req.params.id]);
    res.json({ message: "Grade Deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
