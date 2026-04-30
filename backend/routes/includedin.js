const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all included_in relationships
router.get("/", (req, res) => {
  const query = `
    SELECT 
      ExamID, QuestionID
    FROM INCLUDED_IN
    ORDER BY ExamID, QuestionID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET questions for an exam
router.get("/exam/:examId", (req, res) => {
  const query = `
    SELECT 
      ii.ExamID, ii.QuestionID, q.QuestionText, q.DifficultyLevel, q.Marks, q.BankID
    FROM INCLUDED_IN ii
    JOIN QUESTION q ON ii.QuestionID = q.QuestionID
    WHERE ii.ExamID = ?
  `;
  
  db.query(query, [req.params.examId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET exams containing a question
router.get("/question/:questionId", (req, res) => {
  const query = `
    SELECT 
      ii.ExamID, ii.QuestionID, e.Title, e.ExamDate
    FROM INCLUDED_IN ii
    JOIN EXAM e ON ii.ExamID = e.ExamID
    WHERE ii.QuestionID = ?
  `;
  
  db.query(query, [req.params.questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// INCLUDE a question in an exam
router.post("/", (req, res) => {
  const { ExamID, QuestionID } = req.body;
  
  if (!ExamID || !QuestionID) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO INCLUDED_IN (ExamID, QuestionID)
    VALUES (?, ?)
  `;
  
  db.query(query, [ExamID, QuestionID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Question included in exam successfully" });
  });
});

// REMOVE a question from an exam
router.delete("/:examId/:questionId", (req, res) => {
  const query = `DELETE FROM INCLUDED_IN WHERE ExamID = ? AND QuestionID = ?`;
  
  db.query(query, [req.params.examId, req.params.questionId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question removed from exam successfully" });
  });
});

module.exports = router;
