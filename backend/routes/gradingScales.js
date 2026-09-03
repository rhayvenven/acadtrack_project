const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM grading_scales");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post("/", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM grading_scales WHERE id = ?", [req.params.id]);
    res.json({ message: "Grading Scale Deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
