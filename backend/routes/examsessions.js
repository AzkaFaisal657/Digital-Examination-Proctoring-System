const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

// GET all exam sessions with monitoring proctors
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        es.SessionID,
        es.AttemptNo,
        es.StudentID,
        es.ExamID,
        es.StartTime,
        es.EndTime,
        es.Status,
        es.IPAddress,
        es.BrowserInfo,
        LISTAGG(mb.ProctorID, ', ') WITHIN GROUP (ORDER BY mb.ProctorID) AS MonitoringProctors
       FROM EXAM_SESSION es
       LEFT JOIN MONITORED_BY mb ON es.SessionID = mb.SessionID
       GROUP BY es.SessionID, es.AttemptNo, es.StudentID, es.ExamID, 
                es.StartTime, es.EndTime, es.Status, es.IPAddress, es.BrowserInfo
       ORDER BY es.StartTime DESC`
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

// GET single exam session with monitoring proctors
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        es.SessionID,
        es.AttemptNo,
        es.StudentID,
        es.ExamID,
        es.StartTime,
        es.EndTime,
        es.Status,
        es.IPAddress,
        es.BrowserInfo,
        LISTAGG(mb.ProctorID, ', ') WITHIN GROUP (ORDER BY mb.ProctorID) AS MonitoringProctors
       FROM EXAM_SESSION es
       LEFT JOIN MONITORED_BY mb ON es.SessionID = mb.SessionID
       WHERE es.SessionID = :id
       GROUP BY es.SessionID, es.AttemptNo, es.StudentID, es.ExamID, 
                es.StartTime, es.EndTime, es.Status, es.IPAddress, es.BrowserInfo`,
      { id: req.params.id }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
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

// CREATE new exam session
router.post("/", async (req, res) => {
  let connection;
  try {
    const { AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo } = req.body;

    if (!AttemptNo || !StudentID || !ExamID || !Status) {
      return res.status(400).json({ error: "AttemptNo, StudentID, ExamID, and Status are required" });
    }
    if (isNaN(Number(AttemptNo)) || Number(AttemptNo) < 1) {
      return res.status(400).json({ error: "AttemptNo must be a positive integer" });
    }

    connection = await getConnection();

    // Auto-generate SessionID
    const maxResult = await connection.execute(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(SessionID, '[0-9]+'))), 0) AS MAXNUM FROM EXAM_SESSION WHERE REGEXP_LIKE(SessionID, '^SES[0-9]+$')`
    );
    const nextNum = (maxResult.rows[0].MAXNUM || 0) + 1;
    const SessionID = "SES" + String(nextNum).padStart(3, "0");

    await connection.execute(
      `INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
       VALUES (:SessionID, :AttemptNo, :StudentID, :ExamID, :StartTime, :EndTime, :Status, :IPAddress, :BrowserInfo)`,
      { SessionID, AttemptNo: Number(AttemptNo), StudentID, ExamID, StartTime: StartTime || null, EndTime: EndTime || null, Status, IPAddress: IPAddress || null, BrowserInfo: BrowserInfo || null },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Session created successfully", SessionID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// UPDATE exam session
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { EndTime, Status } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE EXAM_SESSION
       SET EndTime = :EndTime, Status = :Status
       WHERE SessionID = :id`,
      { EndTime: EndTime || null, Status, id: req.params.id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Session updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// DELETE exam session (will cascade delete MONITORED_BY records if FK has ON DELETE CASCADE)
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Delete related MONITORED_BY records first (if no cascade)
    await connection.execute(
      `DELETE FROM MONITORED_BY WHERE SessionID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );

    const result = await connection.execute(
      `DELETE FROM EXAM_SESSION WHERE SessionID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Session not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
