const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID
       FROM VIOLATION
       ORDER BY SessionID, ViolationID`
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
    const { SessionID, Severity, Description, EvidenceURL, CategoryID } = req.body;

    if (!SessionID) {
      return res.status(400).json({ error: "SessionID is required" });
    }

    connection = await getConnection();

    // Auto-generate ViolationID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(ViolationID, '[0-9]+'))), 0) AS MAXNUM FROM VIOLATION WHERE REGEXP_LIKE(ViolationID, '^VIO[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const ViolationID = "VIO" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID)
       VALUES (:ViolationID, :SessionID, :Severity, :Description, :EvidenceURL, :CategoryID)`,
      { ViolationID, SessionID, Severity: Severity || null, Description: Description || null, EvidenceURL: EvidenceURL || null, CategoryID: CategoryID || null }
    );

    res.status(201).json({ message: "Violation created successfully", ViolationID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/:violationId/:sessionId", async (req, res) => {
  let connection;
  try {
    const { violationId, sessionId } = req.params;

    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM VIOLATION
       WHERE ViolationID = :ViolationID
         AND SessionID = :SessionID`,
      { ViolationID: violationId, SessionID: sessionId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Violation not found" });
    }

    res.status(200).json({ message: "Violation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
