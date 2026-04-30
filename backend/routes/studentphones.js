const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all student phones
router.get("/", (req, res) => {
  const query = `
    SELECT 
      StudentID, PhoneNo
    FROM STUDENT_PHONE
    ORDER BY StudentID, PhoneNo
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET phones for a student
router.get("/student/:studentId", (req, res) => {
  const query = `
    SELECT 
      StudentID, PhoneNo
    FROM STUDENT_PHONE
    WHERE StudentID = ?
    ORDER BY PhoneNo
  `;
  
  db.query(query, [req.params.studentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new phone for a student
router.post("/", (req, res) => {
  const { StudentID, PhoneNo } = req.body;
  
  if (!StudentID || !PhoneNo) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
    VALUES (?, ?)
  `;
  
  db.query(query, [StudentID, PhoneNo], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Phone number added successfully" });
  });
});

// UPDATE phone number
router.put("/:studentId/:oldPhone", (req, res) => {
  const { NewPhoneNo } = req.body;
  
  if (!NewPhoneNo) {
    return res.status(400).json({ message: "New phone number required" });
  }
  
  const query = `
    UPDATE STUDENT_PHONE
    SET PhoneNo = ?
    WHERE StudentID = ? AND PhoneNo = ?
  `;
  
  db.query(query, [NewPhoneNo, req.params.studentId, req.params.oldPhone], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Phone number updated successfully" });
  });
});

// DELETE phone number
router.delete("/:studentId/:phoneNo", (req, res) => {
  const query = `DELETE FROM STUDENT_PHONE WHERE StudentID = ? AND PhoneNo = ?`;
  
  db.query(query, [req.params.studentId, req.params.phoneNo], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Phone number deleted successfully" });
  });
});

module.exports = router;
