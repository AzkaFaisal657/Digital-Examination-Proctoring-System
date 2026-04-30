const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all monitored_by relationships
router.get("/", (req, res) => {
  const query = `
    SELECT 
      SessionID, ProctorID
    FROM MONITORED_BY
    ORDER BY SessionID, ProctorID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET proctors for a session
router.get("/session/:sessionId", (req, res) => {
  const query = `
    SELECT 
      mb.SessionID, mb.ProctorID, p.Name, p.Role, p.Email
    FROM MONITORED_BY mb
    JOIN PROCTOR p ON mb.ProctorID = p.ProctorID
    WHERE mb.SessionID = ?
  `;
  
  db.query(query, [req.params.sessionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET sessions monitored by a proctor
router.get("/proctor/:proctorId", (req, res) => {
  const query = `
    SELECT 
      mb.SessionID, mb.ProctorID, es.StudentID, es.ExamID, es.Status
    FROM MONITORED_BY mb
    JOIN EXAM_SESSION es ON mb.SessionID = es.SessionID
    WHERE mb.ProctorID = ?
  `;
  
  db.query(query, [req.params.proctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ASSIGN a proctor to a session
router.post("/", (req, res) => {
  const { SessionID, ProctorID } = req.body;
  
  if (!SessionID || !ProctorID) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO MONITORED_BY (SessionID, ProctorID)
    VALUES (?, ?)
  `;
  
  db.query(query, [SessionID, ProctorID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Proctor assigned to session successfully" });
  });
});

// UNASSIGN a proctor from a session
router.delete("/:sessionId/:proctorId", (req, res) => {
  const query = `DELETE FROM MONITORED_BY WHERE SessionID = ? AND ProctorID = ?`;
  
  db.query(query, [req.params.sessionId, req.params.proctorId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Proctor unassigned from session successfully" });
  });
});

module.exports = router;
