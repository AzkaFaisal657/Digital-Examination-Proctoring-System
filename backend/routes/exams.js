const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID
       FROM EXAM
       ORDER BY ExamID`
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

router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID
       FROM EXAM
       WHERE ExamID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
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

router.post("/", async (req, res) => {
  let connection;
  try {
    const {
      ExamID,
      Title,
      Duration,
      TotalMarks,
      ExamDate,
      Type,
      AllowedAttempts,
      CourseID,
      InstructorID,
    } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
       VALUES (:ExamID, :Title, :Duration, :TotalMarks, TO_DATE(:ExamDate, 'YYYY-MM-DD'), :Type, :AllowedAttempts, :CourseID, :InstructorID)`,
      {
        ExamID,
        Title,
        Duration,
        TotalMarks,
        ExamDate,
        Type,
        AllowedAttempts,
        CourseID,
        InstructorID,
      }
    );

    res.status(201).json({ message: "Exam created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE EXAM
       SET Title = :Title,
           Duration = :Duration,
           TotalMarks = :TotalMarks,
           ExamDate = TO_DATE(:ExamDate, 'YYYY-MM-DD'),
           Type = :Type,
           AllowedAttempts = :AllowedAttempts,
           CourseID = :CourseID,
           InstructorID = :InstructorID
       WHERE ExamID = :id`,
      { Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID, id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM EXAM WHERE ExamID = :id`,
      { id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
