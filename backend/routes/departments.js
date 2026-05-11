const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT DeptID, DeptName, Faculty
       FROM DEPARTMENT
       ORDER BY DeptID`
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
    const { DeptName, Faculty } = req.body;

    if (!DeptName) {
      return res.status(400).json({ error: "DeptName is required" });
    }

    connection = await getConnection();

    // Auto-generate DeptID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(DeptID, '[0-9]+'))), 0) AS MAXNUM FROM DEPARTMENT WHERE REGEXP_LIKE(DeptID, '^DEPT[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const DeptID = "DEPT" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
       VALUES (:DeptID, :DeptName, :Faculty)`,
      { DeptID, DeptName, Faculty: Faculty || null }
    );

    res.status(201).json({ message: "Department created successfully", DeptID });
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
    const { DeptName, Faculty } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE DEPARTMENT
       SET DeptName = :DeptName,
           Faculty = :Faculty
       WHERE DeptID = :id`,
      { DeptName, Faculty, id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully" });
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
      `DELETE FROM DEPARTMENT WHERE DeptID = :id`,
      { id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
