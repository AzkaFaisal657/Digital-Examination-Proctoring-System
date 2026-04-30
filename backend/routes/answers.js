const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all answers
router.get("/", (req, res) => {
  const query = `
    SELECT 
      QuestionID, OptionLabel, AnswerText, IsCorrect
    FROM ANSWER
    ORDER BY QuestionID, OptionLabel
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET all answers for a question
router.get("/question/:questionId", (req, res) => {
  const query = `
    SELECT 
      QuestionID, OptionLabel, AnswerText, IsCorrect
    FROM ANSWER
    WHERE QuestionID = ?
    ORDER BY OptionLabel
  `;
  
  db.query(query, [req.params.questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single answer
router.get("/:questionId/:optionLabel", (req, res) => {
  const query = `
    SELECT 
      QuestionID, OptionLabel, AnswerText, IsCorrect
    FROM ANSWER
    WHERE QuestionID = ? AND OptionLabel = ?
  `;
  
  db.query(query, [req.params.questionId, req.params.optionLabel], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new answer
router.post("/", (req, res) => {
  const { QuestionID, OptionLabel, AnswerText, IsCorrect } = req.body;
  
  if (!QuestionID || !OptionLabel || !AnswerText) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [QuestionID, OptionLabel, AnswerText, IsCorrect || "N"], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Answer created successfully" });
  });
});

// UPDATE answer
router.put("/:questionId/:optionLabel", (req, res) => {
  const { AnswerText, IsCorrect } = req.body;
  
  const query = `
    UPDATE ANSWER
    SET AnswerText = ?, IsCorrect = ?
    WHERE QuestionID = ? AND OptionLabel = ?
  `;
  
  db.query(query, [AnswerText, IsCorrect, req.params.questionId, req.params.optionLabel], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Answer updated successfully" });
  });
});

// DELETE answer
router.delete("/:questionId/:optionLabel", (req, res) => {
  const query = `DELETE FROM ANSWER WHERE QuestionID = ? AND OptionLabel = ?`;
  
  db.query(query, [req.params.questionId, req.params.optionLabel], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Answer deleted successfully" });
  });
});

module.exports = router;
