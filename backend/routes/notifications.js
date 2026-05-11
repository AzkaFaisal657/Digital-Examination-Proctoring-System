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
router.post("/", async (req, res) => {
  const { StudentID, Message, Type } = req.body;

  if (!StudentID || !Message || !Type) {
    return res.status(400).json({ error: "StudentID, Message, and Type are required" });
  }

  try {
    // Auto-generate NotifID
    const existing = await db.query(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(NotifID, '[0-9]+'))), 0) AS MAXNUM FROM NOTIFICATION WHERE REGEXP_LIKE(NotifID, '^NTF[0-9]+$')`
    );
    const nextNum = (existing[0].MAXNUM || 0) + 1;
    const NotifID = "NTF" + String(nextNum).padStart(3, "0");

    await db.query(
      `INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES (?, ?, ?, ?, 'N')`,
      [NotifID, StudentID, Message, Type]
    );
    res.status(201).json({ message: "Notification created successfully", NotifID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
router.delete("/:notifId/:studentId", (req, res) => {
  const query = `DELETE FROM NOTIFICATION WHERE NotifID = ? AND StudentID = ?`;
  
  db.query(query, [req.params.notifId, req.params.studentId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Notification deleted successfully" });
  });
});

module.exports = router;
