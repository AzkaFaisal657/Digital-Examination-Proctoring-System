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
    const { Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID } = req.body;

    if (!Title || Duration === undefined || Duration === null || TotalMarks === undefined || TotalMarks === null || !CourseID || !InstructorID) {
      return res.status(400).json({ error: "Title, Duration, TotalMarks, CourseID, and InstructorID are required" });
    }
    if (isNaN(Number(Duration)) || Number(Duration) <= 0) {
      return res.status(400).json({ error: "Duration must be a positive number (minutes)" });
    }
    if (isNaN(Number(TotalMarks)) || Number(TotalMarks) <= 0) {
      return res.status(400).json({ error: "TotalMarks must be a positive number" });
    }
    if (AllowedAttempts !== undefined && AllowedAttempts !== null && (isNaN(Number(AllowedAttempts)) || Number(AllowedAttempts) < 1)) {
      return res.status(400).json({ error: "AllowedAttempts must be a positive integer" });
    }

    connection = await getConnection();

    // Auto-generate ExamID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(ExamID, '[0-9]+'))), 0) AS MAXNUM FROM EXAM WHERE REGEXP_LIKE(ExamID, '^EX[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const ExamID = "EX" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
       VALUES (:ExamID, :Title, :Duration, :TotalMarks, TO_DATE(:ExamDate, 'YYYY-MM-DD'), :Type, :AllowedAttempts, :CourseID, :InstructorID)`,
      { ExamID, Title, Duration: Number(Duration), TotalMarks: Number(TotalMarks), ExamDate: ExamDate || null, Type: Type || null, AllowedAttempts: AllowedAttempts ? Number(AllowedAttempts) : null, CourseID, InstructorID }
    );

    res.status(201).json({ message: "Exam created successfully", ExamID });
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
