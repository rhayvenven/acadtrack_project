const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

//GET ALL users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, school, grading_scale_id FROM users",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, school, grading_scale_id From users WHERE id = ?",
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (CREATE) a new user (register)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, school, grading_scale_id } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, school, grading_scale_id) 
            VALUES (?, ?, ?, ?, ?)`,
      [name, email, password_hash, school, grading_scale_id],
    );
    res
      .status(201)
      .json({ id: result.insertId, name, email, grading_scale_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
