const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all questions
router.get("/", (req, res) => {
  const query = `
    SELECT 
      QuestionID, QuestionText, DifficultyLevel, Marks, BankID
    FROM QUESTION
    ORDER BY BankID, QuestionID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET questions by bank
router.get("/bank/:bankId", (req, res) => {
  const query = `
    SELECT 
      QuestionID, QuestionText, DifficultyLevel, Marks, BankID
    FROM QUESTION
    WHERE BankID = ?
    ORDER BY QuestionID
  `;
  
  db.query(query, [req.params.bankId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single question
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      QuestionID, QuestionText, DifficultyLevel, Marks, BankID
    FROM QUESTION
    WHERE QuestionID = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new question
router.post("/", (req, res) => {
  const { QuestionID, QuestionText, DifficultyLevel, Marks, BankID, Type, CorrectOptionCount, WordLimit, ModelAnswer } = req.body;
  
  if (!QuestionID || !QuestionText || !Marks || !BankID || !Type) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [QuestionID, QuestionText, DifficultyLevel || "Medium", Marks, BankID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Insert specialization based on type
    if (Type === "MCQ") {
      const mcqQuery = `
        INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
        VALUES (?, ?)
      `;
      db.query(mcqQuery, [QuestionID, CorrectOptionCount || 1], (mcqErr) => {
        if (mcqErr) return res.status(500).json({ error: mcqErr.message });
        res.status(201).json({ message: "MCQ Question created successfully", QuestionID });
      });
    } else if (Type === "Subjective") {
      const subjQuery = `
        INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
        VALUES (?, ?, ?)
      `;
      db.query(subjQuery, [QuestionID, WordLimit || 500, ModelAnswer || ""], (subjErr) => {
        if (subjErr) return res.status(500).json({ error: subjErr.message });
        res.status(201).json({ message: "Subjective Question created successfully", QuestionID });
      });
    } else {
      res.status(201).json({ message: "Question created successfully", QuestionID });
    }
  });
});

// UPDATE question
router.put("/:id", (req, res) => {
  const { QuestionText, DifficultyLevel, Marks } = req.body;
  
  const query = `
    UPDATE QUESTION
    SET QuestionText = ?, DifficultyLevel = ?, Marks = ?
    WHERE QuestionID = ?
  `;
  
  db.query(query, [QuestionText, DifficultyLevel, Marks, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question updated successfully" });
  });
});

// DELETE question
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM QUESTION WHERE QuestionID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Question deleted successfully" });
  });
});

module.exports = router;
