const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const studentsRoutes = require("./routes/students");
const examsRoutes = require("./routes/exams");
const attemptsRoutes = require("./routes/attempts");
const resultsRoutes = require("./routes/results");
const violationsRoutes = require("./routes/violations");
const proctorsRoutes = require("./routes/proctors");
const departmentsRoutes = require("./routes/departments");
const coursesRoutes = require("./routes/courses");
const instructorsRoutes = require("./routes/instructors");
const questionBanksRoutes = require("./routes/questionbanks");
const questionsRoutes = require("./routes/questions");
const answersRoutes = require("./routes/answers");
const subjectiveQuestionsRoutes = require("./routes/subjectivequestions");
const examSessionsRoutes = require("./routes/examsessions");
const notificationsRoutes = require("./routes/notifications");
const violationCategoriesRoutes = require("./routes/violationcategories");
const studentPhonesRoutes = require("./routes/studentphones");
const enrolledInRoutes = require("./routes/enrolledin");
const teachesRoutes = require("./routes/teaches");
const drawsFromRoutes = require("./routes/drawsfrom");
const includedInRoutes = require("./routes/includedin");
const monitoredByRoutes = require("./routes/monitoredby");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.use("/api/students", studentsRoutes);
app.use("/api/exams", examsRoutes);
app.use("/api/attempts", attemptsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/violations", violationsRoutes);
app.use("/api/proctors", proctorsRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/questionbanks", questionBanksRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);
app.use("/api/subjectivequestions", subjectiveQuestionsRoutes);
app.use("/api/examsessions", examSessionsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/violationcategories", violationCategoriesRoutes);
app.use("/api/studentphones", studentPhonesRoutes);
app.use("/api/enrolledin", enrolledInRoutes);
app.use("/api/teaches", teachesRoutes);
app.use("/api/drawsfrom", drawsFromRoutes);
app.use("/api/includedin", includedInRoutes);
app.use("/api/monitoredby", monitoredByRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
