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
    const { ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID)
       VALUES (:ViolationID, :SessionID, :Severity, :Description, :EvidenceURL, :CategoryID)`,
      { ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID }
    );

    res.status(201).json({ message: "Violation created successfully" });
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
