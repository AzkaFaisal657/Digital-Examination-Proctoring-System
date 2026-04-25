const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate
       FROM RESULT
       ORDER BY StudentID, AttemptNo, ResultID`
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

router.post("/", async (req, res) => {
  let connection;
  try {
    const {
      ResultID,
      AttemptNo,
      StudentID,
      ExamID,
      MarksObtained,
      Grade,
      Status,
      PublishedDate,
    } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
       VALUES (
         :ResultID,
         :AttemptNo,
         :StudentID,
         :ExamID,
         :MarksObtained,
         :Grade,
         :Status,
         CASE WHEN :PublishedDate IS NOT NULL THEN TO_DATE(:PublishedDate, 'YYYY-MM-DD') ELSE NULL END
       )`,
      {
        ResultID,
        AttemptNo,
        StudentID,
        ExamID,
        MarksObtained,
        Grade,
        Status,
        PublishedDate,
      }
    );

    res.status(201).json({ message: "Result created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.put("/", async (req, res) => {
  let connection;
  try {
    const { ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE RESULT
       SET ExamID = :ExamID,
           MarksObtained = :MarksObtained,
           Grade = :Grade,
           Status = :Status,
           PublishedDate = CASE WHEN :PublishedDate IS NOT NULL THEN TO_DATE(:PublishedDate, 'YYYY-MM-DD') ELSE NULL END
       WHERE ResultID = :ResultID
         AND AttemptNo = :AttemptNo
         AND StudentID = :StudentID`,
      { ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/", async (req, res) => {
  let connection;
  try {
    const { ResultID, AttemptNo, StudentID } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM RESULT
       WHERE ResultID = :ResultID
         AND AttemptNo = :AttemptNo
         AND StudentID = :StudentID`,
      { ResultID, AttemptNo, StudentID }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
