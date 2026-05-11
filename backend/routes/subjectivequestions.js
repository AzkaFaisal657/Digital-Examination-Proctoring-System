const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

// GET all subjective questions
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        q.QuestionID,
        q.QuestionText,
        q.DifficultyLevel,
        q.Marks,
        q.BankID,
        sq.WordLimit,
        sq.ModelAnswer
       FROM QUESTION q
       INNER JOIN SUBJECTIVE_QUESTION sq ON q.QuestionID = sq.QuestionID
       ORDER BY q.QuestionID`
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

// GET single subjective question
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        q.QuestionID,
        q.QuestionText,
        q.DifficultyLevel,
        q.Marks,
        q.BankID,
        sq.WordLimit,
        sq.ModelAnswer
       FROM QUESTION q
       INNER JOIN SUBJECTIVE_QUESTION sq ON q.QuestionID = sq.QuestionID
       WHERE q.QuestionID = :id`,
      { id: req.params.id }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subjective question not found" });
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

// CREATE subjective question
router.post("/", async (req, res) => {
  let connection;
  try {
    const { QuestionID, QuestionText, DifficultyLevel, Marks, BankID, WordLimit, ModelAnswer } = req.body;
    
    if (!QuestionID || !QuestionText || !Marks || !BankID || !WordLimit || !ModelAnswer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await getConnection();
    
    // Insert into QUESTION first
    await connection.execute(
      `INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
       VALUES (:QuestionID, :QuestionText, :DifficultyLevel, :Marks, :BankID)`,
      { QuestionID, QuestionText, DifficultyLevel: DifficultyLevel || 'Medium', Marks, BankID },
      { autoCommit: false }
    );

    // Then insert into SUBJECTIVE_QUESTION
    await connection.execute(
      `INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
       VALUES (:QuestionID, :WordLimit, :ModelAnswer)`,
      { QuestionID, WordLimit, ModelAnswer },
      { autoCommit: false }
    );

    await connection.commit();
    res.status(201).json({ message: "Subjective question created successfully", QuestionID });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// UPDATE subjective question
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { QuestionText, DifficultyLevel, Marks, WordLimit, ModelAnswer } = req.body;

    connection = await getConnection();

    // Update QUESTION table
    let result = await connection.execute(
      `UPDATE QUESTION
       SET QuestionText = :QuestionText, DifficultyLevel = :DifficultyLevel, Marks = :Marks
       WHERE QuestionID = :id`,
      { QuestionText, DifficultyLevel: DifficultyLevel || 'Medium', Marks, id: req.params.id },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Question not found" });
    }

    // Update SUBJECTIVE_QUESTION table
    await connection.execute(
      `UPDATE SUBJECTIVE_QUESTION
       SET WordLimit = :WordLimit, ModelAnswer = :ModelAnswer
       WHERE QuestionID = :id`,
      { WordLimit, ModelAnswer, id: req.params.id },
      { autoCommit: false }
    );

    await connection.commit();
    res.status(200).json({ message: "Subjective question updated successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// DELETE subjective question
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Delete from SUBJECTIVE_QUESTION first
    await connection.execute(
      `DELETE FROM SUBJECTIVE_QUESTION WHERE QuestionID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );

    // Then delete from QUESTION
    const result = await connection.execute(
      `DELETE FROM QUESTION WHERE QuestionID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Question not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Subjective question deleted successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
