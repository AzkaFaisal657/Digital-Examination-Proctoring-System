const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all notifications
router.get("/", (req, res) => {
  const query = `
    SELECT 
      NotifID, StudentID, Message, Type, NotifTimestamp, IsRead
    FROM NOTIFICATION
    ORDER BY NotifTimestamp DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET notifications for a student
router.get("/student/:studentId", (req, res) => {
  const query = `
    SELECT 
      NotifID, StudentID, Message, Type, NotifTimestamp, IsRead
    FROM NOTIFICATION
    WHERE StudentID = ?
    ORDER BY NotifTimestamp DESC
  `;
  
  db.query(query, [req.params.studentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// CREATE new notification
router.post("/", (req, res) => {
  const { NotifID, StudentID, Message, Type } = req.body;
  
  if (!NotifID || !StudentID || !Message || !Type) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead)
    VALUES (?, ?, ?, ?, 'N')
  `;
  
  db.query(query, [NotifID, StudentID, Message, Type], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Notification created successfully", NotifID });
  });
});

// MARK as read
router.put("/:id/read", (req, res) => {
  const query = `
    UPDATE NOTIFICATION
    SET IsRead = 'Y'
    WHERE NotifID = ?
  `;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Notification marked as read" });
  });
});

// DELETE notification
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM NOTIFICATION WHERE NotifID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Notification deleted successfully" });
  });
});

module.exports = router;
