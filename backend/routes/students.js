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
    const {
      StudentID,
      FirstName,
      LastName,
      RegNo,
      Email,
      Program,
      BatchYear,
      DOB,
    } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
       VALUES (:StudentID, :FirstName, :LastName, :RegNo, :Email, :Program, :BatchYear, TO_DATE(:DOB, 'YYYY-MM-DD'))`,
      { StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB }
    );

    res.status(201).json({ message: "Student created successfully" });
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
