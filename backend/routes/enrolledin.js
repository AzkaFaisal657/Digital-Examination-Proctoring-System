const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all enrollments
router.get("/", (req, res) => {
  const query = `
    SELECT 
      StudentID, CourseID
    FROM ENROLLED_IN
    ORDER BY StudentID, CourseID
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET courses for a student
router.get("/student/:studentId", (req, res) => {
  const query = `
    SELECT 
      ei.StudentID, ei.CourseID, c.CourseTitle, c.Semester, c.DeptID
    FROM ENROLLED_IN ei
    JOIN COURSE c ON ei.CourseID = c.CourseID
    WHERE ei.StudentID = ?
  `;
  
  db.query(query, [req.params.studentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET students in a course
router.get("/course/:courseId", (req, res) => {
  const query = `
    SELECT 
      ei.StudentID, ei.CourseID, s.FirstName, s.LastName, s.Email
    FROM ENROLLED_IN ei
    JOIN STUDENT s ON ei.StudentID = s.StudentID
    WHERE ei.CourseID = ?
  `;
  
  db.query(query, [req.params.courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ENROLL a student in a course
router.post("/", (req, res) => {
  const { StudentID, CourseID } = req.body;
  
  if (!StudentID || !CourseID) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const query = `
    INSERT INTO ENROLLED_IN (StudentID, CourseID)
    VALUES (?, ?)
  `;
  
  db.query(query, [StudentID, CourseID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Student enrolled successfully" });
  });
});

// UNENROLL a student from a course
router.delete("/:studentId/:courseId", (req, res) => {
  const query = `DELETE FROM ENROLLED_IN WHERE StudentID = ? AND CourseID = ?`;
  
  db.query(query, [req.params.studentId, req.params.courseId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Student unenrolled successfully" });
  });
});

module.exports = router;
