const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all exam sessions
router.get("/", (req, res) => {
  const query = `
    SELECT 
      SessionID, AttemptNo, StudentID, ExamID, 
      StartTime, EndTime, Status, IPAddress, BrowserInfo
    FROM EXAM_SESSION
    ORDER BY StartTime DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single exam session
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      SessionID, AttemptNo, StudentID, ExamID, 
      StartTime, EndTime, Status, IPAddress, BrowserInfo
    FROM EXAM_SESSION
    WHERE SessionID = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new exam session
router.post("/", (req, res) => {
  const { SessionID, AttemptNo, StudentID, ExamID, StartTime, Status, IPAddress, BrowserInfo } = req.body;
  
  if (!SessionID || !AttemptNo || !StudentID || !ExamID || !Status) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO EXAM_SESSION 
    (SessionID, AttemptNo, StudentID, ExamID, StartTime, Status, IPAddress, BrowserInfo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [SessionID, AttemptNo, StudentID, ExamID, StartTime, Status, IPAddress, BrowserInfo], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Session created successfully", SessionID });
  });
});

// UPDATE exam session
router.put("/:id", (req, res) => {
  const { EndTime, Status } = req.body;
  
  const query = `
    UPDATE EXAM_SESSION
    SET EndTime = ?, Status = ?
    WHERE SessionID = ?
  `;
  
  db.query(query, [EndTime, Status, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Session updated successfully" });
  });
});

// DELETE exam session
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM EXAM_SESSION WHERE SessionID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Session deleted successfully" });
  });
});

module.exports = router;
