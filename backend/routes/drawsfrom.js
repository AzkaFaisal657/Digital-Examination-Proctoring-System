const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all draws_from relationships
router.get("/", (req, res) => {
  const query = `
    SELECT 
      ExamID, BankID
    FROM DRAWS_FROM
    ORDER BY ExamID, BankID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET question banks for an exam
router.get("/exam/:examId", (req, res) => {
  const query = `
    SELECT 
      df.ExamID, df.BankID, qb.BankName, qb.Subject
    FROM DRAWS_FROM df
    JOIN QUESTION_BANK qb ON df.BankID = qb.BankID
    WHERE df.ExamID = ?
  `;
  
  db.query(query, [req.params.examId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET exams using a question bank
router.get("/bank/:bankId", (req, res) => {
  const query = `
    SELECT 
      df.ExamID, df.BankID, e.Title, e.ExamDate
    FROM DRAWS_FROM df
    JOIN EXAM e ON df.ExamID = e.ExamID
    WHERE df.BankID = ?
  `;
  
  db.query(query, [req.params.bankId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// LINK an exam with a question bank
router.post("/", (req, res) => {
  const { ExamID, BankID } = req.body;
  
  if (!ExamID || !BankID) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO DRAWS_FROM (ExamID, BankID)
    VALUES (?, ?)
  `;
  
  db.query(query, [ExamID, BankID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Question bank linked to exam successfully" });
  });
});

// UNLINK an exam from a question bank
router.delete("/:examId/:bankId", (req, res) => {
  const query = `DELETE FROM DRAWS_FROM WHERE ExamID = ? AND BankID = ?`;
  
  db.query(query, [req.params.examId, req.params.bankId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question bank unlinked from exam successfully" });
  });
});

module.exports = router;
