const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT AttemptNo, StudentID, ExamID, AttemptDate, Status
       FROM ATTEMPT
       ORDER BY StudentID, ExamID, AttemptNo`
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
    const { AttemptNo, StudentID, ExamID, Status } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, Status)
       VALUES (:AttemptNo, :StudentID, :ExamID, :Status)`,
      { AttemptNo, StudentID, ExamID, Status }
    );

    res.status(201).json({ message: "Attempt created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.put("/:attemptNo/:studentId/:examId", async (req, res) => {
  let connection;
  try {
    const { attemptNo, studentId, examId } = req.params;
    const { Status } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE ATTEMPT
       SET Status = :Status
       WHERE AttemptNo = :AttemptNo
         AND StudentID = :StudentID
         AND ExamID = :ExamID`,
      { Status, AttemptNo: attemptNo, StudentID: studentId, ExamID: examId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.status(200).json({ message: "Attempt updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/:attemptNo/:studentId/:examId", async (req, res) => {
  let connection;
  try {
    const { attemptNo, studentId, examId } = req.params;

    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM ATTEMPT
       WHERE AttemptNo = :AttemptNo
         AND StudentID = :StudentID
         AND ExamID = :ExamID`,
      { AttemptNo: attemptNo, StudentID: studentId, ExamID: examId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.status(200).json({ message: "Attempt deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
