const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL grading scales
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM grading_scales");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one grading scale by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM grading_scales WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Grading Scale not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST (CREATE) a new grading scale
router.post("/", async (req, res) => {
  try {
    const { school_name, scale_type, best_value, worst_value, passing_value } =
      req.body;
    const [result] = await db.query(
      "INSERT INTO grading_scales (school_name, scale_type, best_value, worst_value, passing_value) VALUES (?, ?, ?, ?, ?)",
      [school_name, scale_type, best_value, worst_value, passing_value],
    );
    res.status(201).json({
      id: result.insertId,
      ...req.body,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const { school_name, scale_type, best_value, worst_value, passing_value } =
      req.body;
    await db.query(
      `UPDATE grading_scales
            SET school_name = ?, scale_type = ?, best_value = ?, worst_value = ?, passing_value = ?
            WHERE id = ?`,
      [
        school_name,
        scale_type,
        best_value,
        worst_value,
        passing_value,
        req.params.id,
      ],
    );
    res.json({ message: "Grading Scale Updated " });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM grading_scales WHERE id = ?", [req.params.id]);
    res.json({ message: "Grading Scale Deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
