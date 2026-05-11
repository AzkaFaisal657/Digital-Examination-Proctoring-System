const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB,
              FLOOR(MONTHS_BETWEEN(SYSDATE, DOB) / 12) AS Age
       FROM STUDENT
       ORDER BY StudentID`
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
      `SELECT StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB,
              FLOOR(MONTHS_BETWEEN(SYSDATE, DOB) / 12) AS Age
       FROM STUDENT
       WHERE StudentID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
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
    const { FirstName, LastName, RegNo, Email, Program, BatchYear, DOB } = req.body;

    if (!FirstName || !LastName || !DOB) {
      return res.status(400).json({ error: "FirstName, LastName, and DOB are required" });
    }
    if (Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (BatchYear && (isNaN(BatchYear) || BatchYear < 1900 || BatchYear > 2100)) {
      return res.status(400).json({ error: "BatchYear must be a valid 4-digit year" });
    }

    connection = await getConnection();

    // Auto-generate StudentID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(StudentID, '[0-9]+'))), 0) AS MAXNUM FROM STUDENT WHERE REGEXP_LIKE(StudentID, '^STU[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const StudentID = "STU" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
       VALUES (:StudentID, :FirstName, :LastName, :RegNo, :Email, :Program, :BatchYear, TO_DATE(:DOB, 'YYYY-MM-DD'))`,
      { StudentID, FirstName, LastName, RegNo: RegNo || null, Email: Email || null, Program: Program || null, BatchYear: BatchYear || null, DOB }
    );

    res.status(201).json({ message: "Student created successfully", StudentID });
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
    const { FirstName, LastName, RegNo, Email, Program, BatchYear, DOB } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE STUDENT
       SET FirstName = :FirstName,
           LastName = :LastName,
           RegNo = :RegNo,
           Email = :Email,
           Program = :Program,
           BatchYear = :BatchYear,
           DOB = TO_DATE(:DOB, 'YYYY-MM-DD')
       WHERE StudentID = :id`,
      { FirstName, LastName, RegNo, Email, Program, BatchYear, DOB, id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
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
      `DELETE FROM STUDENT WHERE StudentID = :id`,
      { id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
