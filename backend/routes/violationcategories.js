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
router.post("/", (req, res) => {
  const { CategoryID, CategoryName, DefaultSeverity } = req.body;
  
  if (!CategoryID || !CategoryName || !DefaultSeverity) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
    VALUES (?, ?, ?)
  `;
  
  db.query(query, [CategoryID, CategoryName, DefaultSeverity], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Violation category created successfully", CategoryID });
  });
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
