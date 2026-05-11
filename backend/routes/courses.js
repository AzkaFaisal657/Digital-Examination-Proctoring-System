const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT CourseID, CourseTitle, CreditHours, Semester, DeptID
       FROM COURSE
       ORDER BY CourseID`
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
    const { CourseTitle, CreditHours, Semester, DeptID } = req.body;

    if (!CourseTitle || CreditHours === undefined || CreditHours === null || !DeptID) {
      return res.status(400).json({ error: "CourseTitle, CreditHours, and DeptID are required" });
    }
    if (isNaN(Number(CreditHours)) || Number(CreditHours) < 1 || Number(CreditHours) > 6) {
      return res.status(400).json({ error: "CreditHours must be a number between 1 and 6" });
    }

    connection = await getConnection();

    // Auto-generate CourseID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(CourseID, '[0-9]+'))), 0) AS MAXNUM FROM COURSE WHERE REGEXP_LIKE(CourseID, '^CRS[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const CourseID = "CRS" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
       VALUES (:CourseID, :CourseTitle, :CreditHours, :Semester, :DeptID)`,
      { CourseID, CourseTitle, CreditHours: Number(CreditHours), Semester: Semester || null, DeptID }
    );

    res.status(201).json({ message: "Course created successfully", CourseID });
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
    const { CourseTitle, CreditHours, Semester, DeptID } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE COURSE
       SET CourseTitle = :CourseTitle,
           CreditHours = :CreditHours,
           Semester = :Semester,
           DeptID = :DeptID
       WHERE CourseID = :id`,
      { CourseTitle, CreditHours, Semester, DeptID, id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully" });
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
      `DELETE FROM COURSE WHERE CourseID = :id`,
      { id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
