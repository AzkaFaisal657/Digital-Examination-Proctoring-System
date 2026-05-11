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
router.post("/", async (req, res) => {
  const { FirstName, LastName, Email, Designation, Specialization } = req.body;

  if (!FirstName || !LastName || !Email) {
    return res.status(400).json({ error: "FirstName, LastName, and Email are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Auto-generate InstructorID
    const existing = await db.query(
      `SELECT NVL(MAX(TO_NUMBER(REGEXP_SUBSTR(InstructorID, '[0-9]+'))), 0) AS MAXNUM FROM INSTRUCTOR WHERE REGEXP_LIKE(InstructorID, '^INS[0-9]+$')`
    );
    const nextNum = (existing[0].MAXNUM || 0) + 1;
    const InstructorID = "INS" + String(nextNum).padStart(3, "0");

    await db.query(
      `INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization) VALUES (?, ?, ?, ?, ?, ?)`,
      [InstructorID, FirstName, LastName, Email, Designation || null, Specialization || null]
    );
    res.status(201).json({ message: "Instructor created successfully", InstructorID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
