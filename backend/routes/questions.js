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
router.post("/", async (req, res) => {
  const { QuestionText, DifficultyLevel, Marks, BankID, Type, CorrectOptionCount, WordLimit, ModelAnswer } = req.body;

  if (!QuestionText || Marks === undefined || Marks === null || !BankID || !Type) {
    return res.status(400).json({ error: "QuestionText, Marks, BankID, and Type are required" });
  }
  if (isNaN(Number(Marks)) || Number(Marks) <= 0) {
    return res.status(400).json({ error: "Marks must be a positive number" });
  }

  try {
    // Auto-generate QuestionID
    const existing = await db.query(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(QuestionID, '[0-9]+'))), 0) AS MAXNUM FROM QUESTION WHERE REGEXP_LIKE(QuestionID, '^QST[0-9]+$')`
    );
    const nextNum = (existing[0].MAXNUM || 0) + 1;
    const QuestionID = "QST" + String(nextNum).padStart(3, "0");

    await db.query(
      `INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES (?, ?, ?, ?, ?)`,
      [QuestionID, QuestionText, DifficultyLevel || "Medium", Number(Marks), BankID]
    );

    // Insert specialization based on type
    if (Type === "MCQ") {
      await db.query(
        `INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount) VALUES (?, ?)`,
        [QuestionID, CorrectOptionCount ? Number(CorrectOptionCount) : 1]
      );
    } else if (Type === "Subjective") {
      await db.query(
        `INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES (?, ?, ?)`,
        [QuestionID, WordLimit ? Number(WordLimit) : 500, ModelAnswer || ""]
      );
    }

    res.status(201).json({ message: "Question created successfully", QuestionID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
