const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all teaches relationships
router.get("/", (req, res) => {
  const query = `
    SELECT 
      InstructorID, CourseID
    FROM TEACHES
    ORDER BY InstructorID, CourseID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET courses taught by an instructor
router.get("/instructor/:instructorId", (req, res) => {
  const query = `
    SELECT 
      t.InstructorID, t.CourseID, c.CourseTitle, c.Semester, c.DeptID
    FROM TEACHES t
    JOIN COURSE c ON t.CourseID = c.CourseID
    WHERE t.InstructorID = ?
  `;
  
  db.query(query, [req.params.instructorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET instructors for a course
router.get("/course/:courseId", (req, res) => {
  const query = `
    SELECT 
      t.InstructorID, t.CourseID, i.FirstName, i.LastName, i.Email
    FROM TEACHES t
    JOIN INSTRUCTOR i ON t.InstructorID = i.InstructorID
    WHERE t.CourseID = ?
  `;
  
  db.query(query, [req.params.courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ASSIGN an instructor to a course
router.post("/", (req, res) => {
  const { InstructorID, CourseID } = req.body;
  
  if (!InstructorID || !CourseID) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO TEACHES (InstructorID, CourseID)
    VALUES (?, ?)
  `;
  
  db.query(query, [InstructorID, CourseID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Instructor assigned successfully" });
  });
});

// UNASSIGN an instructor from a course
router.delete("/:instructorId/:courseId", (req, res) => {
  const query = `DELETE FROM TEACHES WHERE InstructorID = ? AND CourseID = ?`;
  
  db.query(query, [req.params.instructorId, req.params.courseId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Instructor unassigned successfully" });
  });
});

module.exports = router;
