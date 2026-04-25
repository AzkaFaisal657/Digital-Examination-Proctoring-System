const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentsRoutes = require("./routes/students");
const examsRoutes = require("./routes/exams");
const attemptsRoutes = require("./routes/attempts");
const resultsRoutes = require("./routes/results");
const violationsRoutes = require("./routes/violations");
const proctorsRoutes = require("./routes/proctors");
const departmentsRoutes = require("./routes/departments");
const coursesRoutes = require("./routes/courses");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/students", studentsRoutes);
app.use("/api/exams", examsRoutes);
app.use("/api/attempts", attemptsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/violations", violationsRoutes);
app.use("/api/proctors", proctorsRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/courses", coursesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
