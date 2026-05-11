const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all violation categories
router.get("/", (req, res) => {
  const query = `
    SELECT 
      CategoryID, CategoryName, DefaultSeverity
    FROM VIOLATION_CATEGORY
    ORDER BY CategoryID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single violation category
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      CategoryID, CategoryName, DefaultSeverity
    FROM VIOLATION_CATEGORY
    WHERE CategoryID = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Violation category not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new violation category
router.post("/", async (req, res) => {
  const { CategoryName, DefaultSeverity } = req.body;

  if (!CategoryName || !DefaultSeverity) {
    return res.status(400).json({ error: "CategoryName and DefaultSeverity are required" });
  }

  try {
    // Auto-generate CategoryID
    const existing = await db.query(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(CategoryID, '[0-9]+'))), 0) AS MAXNUM FROM VIOLATION_CATEGORY WHERE REGEXP_LIKE(CategoryID, '^CAT[0-9]+$')`
    );
    const nextNum = (existing[0].MAXNUM || 0) + 1;
    const CategoryID = "CAT" + String(nextNum).padStart(3, "0");

    await db.query(
      `INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES (?, ?, ?)`,
      [CategoryID, CategoryName, DefaultSeverity]
    );
    res.status(201).json({ message: "Violation category created successfully", CategoryID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE violation category
router.put("/:id", (req, res) => {
  const { CategoryName, DefaultSeverity } = req.body;
  
  const query = `
    UPDATE VIOLATION_CATEGORY
    SET CategoryName = ?, DefaultSeverity = ?
    WHERE CategoryID = ?
  `;
  
  db.query(query, [CategoryName, DefaultSeverity, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Violation category updated successfully" });
  });
});

// DELETE violation category
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM VIOLATION_CATEGORY WHERE CategoryID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Violation category deleted successfully" });
  });
});

module.exports = router;
