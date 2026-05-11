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
    const { StudentID, ExamID, Status } = req.body;

    if (!StudentID || !ExamID) {
      return res.status(400).json({ error: "StudentID and ExamID are required" });
    }

    connection = await getConnection();

    // Auto-generate AttemptNo: max attempt for this student+exam + 1
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(AttemptNo), 0) AS MAXNUM FROM ATTEMPT WHERE StudentID = :StudentID AND ExamID = :ExamID`,
      { StudentID, ExamID }
    );
    const AttemptNo = (maxResult.rows[0].MAXNUM || 0) + 1;

    await connection.execute(
      `INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, Status)
       VALUES (:AttemptNo, :StudentID, :ExamID, :Status)`,
      { AttemptNo, StudentID, ExamID, Status: Status || null }
    );

    res.status(201).json({ message: "Attempt created successfully", AttemptNo });
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
