const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all question banks
router.get("/", (req, res) => {
  const query = `
    SELECT 
      BankID, BankName, Subject, CreatedDate, InstructorID
    FROM QUESTION_BANK
    ORDER BY CreatedDate DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET question banks by instructor
router.get("/instructor/:instructorId", (req, res) => {
  const query = `
    SELECT 
      BankID, BankName, Subject, CreatedDate, InstructorID
    FROM QUESTION_BANK
    WHERE InstructorID = ?
    ORDER BY CreatedDate DESC
  `;
  
  db.query(query, [req.params.instructorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single question bank
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      BankID, BankName, Subject, CreatedDate, InstructorID
    FROM QUESTION_BANK
    WHERE BankID = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Question bank not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new question bank
router.post("/", async (req, res) => {
  const { BankName, Subject, InstructorID } = req.body;

  if (!BankName || !InstructorID) {
    return res.status(400).json({ error: "BankName and InstructorID are required" });
  }

  try {
    // Auto-generate BankID
    const existing = await db.query(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(BankID, '[0-9]+'))), 0) AS MAXNUM FROM QUESTION_BANK WHERE REGEXP_LIKE(BankID, '^QB[0-9]+$')`
    );
    const nextNum = (existing[0].MAXNUM || 0) + 1;
    const BankID = "QB" + String(nextNum).padStart(3, "0");

    await db.query(
      `INSERT INTO QUESTION_BANK (BankID, BankName, Subject, InstructorID) VALUES (?, ?, ?, ?)`,
      [BankID, BankName, Subject || null, InstructorID]
    );
    res.status(201).json({ message: "Question bank created successfully", BankID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE question bank
router.put("/:id", (req, res) => {
  const { BankName, Subject } = req.body;
  
  const query = `
    UPDATE QUESTION_BANK
    SET BankName = ?, Subject = ?
    WHERE BankID = ?
  `;
  
  db.query(query, [BankName, Subject, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question bank updated successfully" });
  });
});

// DELETE question bank
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM QUESTION_BANK WHERE BankID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question bank deleted successfully" });
  });
});

module.exports = router;
