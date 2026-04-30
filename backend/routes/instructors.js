const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all instructors
router.get("/", (req, res) => {
  const query = `
    SELECT 
      InstructorID, FirstName, LastName, Email, Designation, Specialization
    FROM INSTRUCTOR
    ORDER BY InstructorID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET single instructor
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      InstructorID, FirstName, LastName, Email, Designation, Specialization
    FROM INSTRUCTOR
    WHERE InstructorID = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.json(results[0]);
  });
});

// CREATE new instructor
router.post("/", (req, res) => {
  const { InstructorID, FirstName, LastName, Email, Designation, Specialization } = req.body;
  
  if (!InstructorID || !FirstName || !LastName || !Email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [InstructorID, FirstName, LastName, Email, Designation, Specialization], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Instructor created successfully", InstructorID });
  });
});

// UPDATE instructor
router.put("/:id", (req, res) => {
  const { FirstName, LastName, Email, Designation, Specialization } = req.body;
  
  const query = `
    UPDATE INSTRUCTOR
    SET FirstName = ?, LastName = ?, Email = ?, Designation = ?, Specialization = ?
    WHERE InstructorID = ?
  `;
  
  db.query(query, [FirstName, LastName, Email, Designation, Specialization, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Instructor updated successfully" });
  });
});

// DELETE instructor
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM INSTRUCTOR WHERE InstructorID = ?`;
  
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Instructor deleted successfully" });
  });
});

module.exports = router;
