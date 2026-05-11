const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

// GET all subjective answers (model answers for subjective questions)
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        sq.QuestionID,
        q.QuestionText,
        sq.ModelAnswer,
        sq.WordLimit
       FROM SUBJECTIVE_QUESTION sq
       INNER JOIN QUESTION q ON q.QuestionID = sq.QuestionID
       ORDER BY sq.QuestionID`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// GET single subjective answer
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        sq.QuestionID,
        q.QuestionText,
        sq.ModelAnswer,
        sq.WordLimit
       FROM SUBJECTIVE_QUESTION sq
       INNER JOIN QUESTION q ON q.QuestionID = sq.QuestionID
       WHERE sq.QuestionID = :id`,
      { id: req.params.id }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subjective answer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// CREATE subjective answer (create or update MODEL ANSWER for existing question)
router.post("/", async (req, res) => {
  let connection;
  try {
    const { QuestionID, ModelAnswer, WordLimit } = req.body;
    
    if (!QuestionID || !ModelAnswer || !WordLimit) {
      return res.status(400).json({ error: "QuestionID, ModelAnswer, and WordLimit are required" });
    }

    connection = await getConnection();
    
    // Check if subjective answer already exists for this question
    const checkResult = await connection.execute(
      `SELECT * FROM SUBJECTIVE_QUESTION WHERE QuestionID = :QuestionID`,
      { QuestionID }
    );

    if (checkResult.rows.length > 0) {
      // Update existing
      await connection.execute(
        `UPDATE SUBJECTIVE_QUESTION
         SET ModelAnswer = :ModelAnswer, WordLimit = :WordLimit
         WHERE QuestionID = :QuestionID`,
        { ModelAnswer, WordLimit, QuestionID },
        { autoCommit: true }
      );
      res.status(200).json({ message: "Subjective answer updated successfully", QuestionID });
    } else {
      // Insert new
      await connection.execute(
        `INSERT INTO SUBJECTIVE_QUESTION (QuestionID, ModelAnswer, WordLimit)
         VALUES (:QuestionID, :ModelAnswer, :WordLimit)`,
        { QuestionID, ModelAnswer, WordLimit },
        { autoCommit: true }
      );
      res.status(201).json({ message: "Subjective answer created successfully", QuestionID });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// UPDATE subjective answer
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { ModelAnswer, WordLimit } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `UPDATE SUBJECTIVE_QUESTION
       SET ModelAnswer = :ModelAnswer, WordLimit = :WordLimit
       WHERE QuestionID = :id`,
      { ModelAnswer, WordLimit, id: req.params.id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Subjective answer not found" });
    }

    res.status(200).json({ message: "Subjective answer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// DELETE subjective answer
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `DELETE FROM SUBJECTIVE_QUESTION WHERE QuestionID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Subjective answer not found" });
    }

    res.status(200).json({ message: "Subjective answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
