# Digital Examination & Proctoring System - Full Implementation Documentation

## 1) Purpose of This Document

This file explains the complete work done in Phase 2 from start to finish:

- What was built
- Why each part was built that way
- How to run and test each part
- How the implementation matches the Phase 1 EERD and Phase 2 manual

It is written for beginners, so a group partner can understand everything without guessing.

## 2) Project Scope and Manual Compliance

Phase 2 required:

1. SQL database implementation in Oracle or MySQL
2. Web frontend for CRUD demo
3. Create, Read, Update, Delete operations working from the UI
4. Schema consistent with Phase 1 EERD

This project uses:

- Oracle XE (allowed)
- Node.js + Express backend
- Vanilla HTML/CSS/JS frontend

Important:

- No advanced or fancy SQL was required for grading.
- The implementation focuses on common SQL commands and basic integrity constraints.

## 3) Folder Structure Created

Root folder:

- backend/ -> Node.js server and API routes
- frontend/ -> HTML/CSS/JS interface
- sql/ -> schema and sample data scripts
- README.md -> setup and usage instructions
- .gitignore -> excludes node_modules, .env, and logs

Main files inside backend:

- backend/server.js
- backend/db.js
- backend/package.json
- backend/routes/students.js
- backend/routes/instructors.js
- backend/routes/exams.js
- backend/routes/questionbanks.js
- backend/routes/questions.js
- backend/routes/answers.js
- backend/routes/examsessions.js
- backend/routes/notifications.js
- backend/routes/violationcategories.js
- backend/routes/studentphones.js
- backend/routes/attempts.js
- backend/routes/results.js
- backend/routes/violations.js
- backend/routes/proctors.js
- backend/routes/departments.js
- backend/routes/courses.js
- backend/routes/enrolledin.js
- backend/routes/teaches.js
- backend/routes/drawsfrom.js
- backend/routes/includedin.js
- backend/routes/monitoredby.js

Main files inside frontend:

- frontend/index.html
- frontend/styles.css
- frontend/app.js

Main files inside sql:

- sql/schema.sql
- sql/sample_data.sql

Current validated state:

- The backend is currently serving the API on port 5000.
- The dashboard fetches counts from all current entity modules.
- The sample data is populated for the new tables, including exam sessions, notifications, question banks, questions, answers, violation categories, and student phones.

## 4) Database Implementation (Oracle)

### 4.1) Schema Script

The full schema is in sql/schema.sql.

It includes:

1. Strong entities
2. Weak entities with composite keys
3. Specialization tables
4. M:N junction tables

### 4.2) Strong Entities Implemented

- DEPARTMENT
- COURSE
- INSTRUCTOR
- STUDENT
- EXAM
- QUESTION_BANK
- QUESTION
- PROCTOR
- EXAM_SESSION
- VIOLATION_CATEGORY

### 4.3) Weak Entities Implemented

- ANSWER (PK: QuestionID + OptionLabel)
- ATTEMPT (PK: AttemptNo + StudentID + ExamID)
- RESULT (PK: ResultID + AttemptNo + StudentID)
- VIOLATION (PK: ViolationID + SessionID)
- NOTIFICATION (PK: NotifID + StudentID)

### 4.4) Specialization Tables Implemented

- MCQ_QUESTION (child of QUESTION)
- SUBJECTIVE_QUESTION (child of QUESTION)
- HUMAN_PROCTOR (child of PROCTOR)
- AI_PROCTOR (child of PROCTOR)
- STUDENT_PHONE (multivalued attribute table)

AI proctors are stored as a PROCTOR row plus an AI_PROCTOR subtype row. The subtype keeps the AI-specific metadata such as AlgorithmVersion and ModelName so a monitored session can be traced back to the exact AI setup used at that time.

### 4.5) M:N Junction Tables Implemented

- ENROLLED_IN
- TEACHES
- DRAWS_FROM
- INCLUDED_IN
- MONITORED_BY

### 4.6) Oracle-Specific Choices

Used Oracle-friendly syntax:

- VARCHAR2
- NUMBER
- DATE / TIMESTAMP
- SYSDATE / SYSTIMESTAMP
- TO_DATE

Basic constraints used:

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- CHECK
- NOT NULL
- DEFAULT

## 5) Sample Data Script

sql/sample_data.sql inserts starter records for demo:

- Departments, Courses, Instructors, Students
- Exams, Question Banks, Questions, Answers
- Proctors, Sessions, Attempts, Results, Violations
- Notifications and junction table records

Reason:

- Dashboard and tables show real data during live demo/viva.

## 6) Backend Implementation

### 6.1) Packages Installed

- express
- oracledb
- cors
- dotenv

### 6.2) Server Entry

backend/server.js:

- Starts Express server
- Enables JSON and CORS middleware
- Serves the frontend app from the backend root URL
- Adds health endpoint: /api/health
- Mounts route modules under /api/*

### 6.3) Oracle Connection Layer

backend/db.js handles database connection.

What it does:

1. Reads environment variables from .env
2. Uses object row format for easier JSON responses
3. Enables auto-commit for basic CRUD behavior
4. Initializes Oracle thick client for Oracle XE 11g compatibility
5. Sets CURRENT_SCHEMA (DB_SCHEMA) so unqualified table names work

Why thick mode was needed:

- Thin mode raised compatibility issues with local XE setup.
- Thick mode solved service/version compatibility for this machine.

### 6.4) Environment Variables

Expected .env values:

- DB_USER=system
- DB_PASSWORD=your_oracle_password
- DB_CONNECTION=localhost:1521/XE
- DB_SCHEMA=PROJECT
- PORT=5000

Notes:

- Use your own password locally.
- Do not commit .env (already ignored by .gitignore).

### 6.5) Route Modules and CRUD Coverage

Implemented API modules:

- /api/students
- /api/instructors
- /api/exams
- /api/questionbanks
- /api/questions
- /api/answers
- /api/examsessions
- /api/notifications
- /api/violationcategories
- /api/studentphones
- /api/attempts
- /api/results
- /api/violations
- /api/proctors
- /api/departments
- /api/courses
- /api/enrolledin
- /api/teaches
- /api/drawsfrom
- /api/includedin
- /api/monitoredby

Operation coverage:

- Students: GET all, GET by ID, POST, PUT, DELETE
- Instructors: GET all, GET by ID, POST, PUT, DELETE
- Exams: GET all, GET by ID, POST, PUT, DELETE
- Question banks: GET all, GET by ID, POST, PUT, DELETE
- Questions: GET all, GET by ID, POST, PUT, DELETE
- Answers: GET all, GET by question, GET by composite key, POST, PUT, DELETE
- Exam sessions: GET all, GET by ID, POST, PUT, DELETE
- Notifications: GET all, GET by student, POST, mark as read, DELETE
- Violation categories: GET all, GET by ID, POST, PUT, DELETE
- Student phones: GET all, GET by student, POST, PUT, DELETE
- Attempts: GET all, POST, PUT, DELETE
- Results: GET all, POST, PUT, DELETE
- Violations: GET all, POST, DELETE
- Proctors: GET all, POST, PUT, DELETE
- Departments: GET all, POST, PUT, DELETE
- Courses: GET all, POST, PUT, DELETE
- Junction tables: GET all, GET by parent/child, POST, DELETE

### 6.6) SQL Simplicity (Beginner-Friendly)

The backend mostly uses:

- INSERT INTO ... VALUES ...
- SELECT ... FROM ... WHERE ...
- UPDATE ... SET ... WHERE ...
- DELETE FROM ... WHERE ...

No advanced SQL features were required for core CRUD demonstration.

## 7) Frontend Implementation

### 7.1) UI Structure

frontend/index.html provides:

- Sidebar navigation for modules
- Main dashboard area
- Reusable form modal for create/update
- Confirmation modal for delete
- Toast notifications for feedback

The sidebar now includes the expanded entity set from the EERD:

- Instructors
- Question Banks
- Questions
- Answers
- Exam Sessions
- Notifications
- Violation Categories
- Student Phones

The frontend is now served through the backend at http://localhost:5000/ so the browser stays on an HTTP origin and API calls work reliably.

### 7.2) Styling

frontend/styles.css provides:

- Grayscale, clean dashboard look
- Responsive layout for desktop and mobile
- Clear table, form, and modal styling

### 7.3) Frontend Logic

frontend/app.js provides:

- API base URL handling
- Module configuration for each entity
- Dynamic rendering of table columns and forms
- Search and filter behavior
- Modal form submit handling
- Delete confirmation handling
- Toast messages for success/error

Current proctor workflow:

1. Click Add Proctor.
2. Choose Human Proctor or AI Proctor in Step 1.
3. Step 2 shows only the matching fields.
4. Human proctors use Email, Role, and Designation.
5. AI proctors use AlgorithmVersion and ModelName.
6. AI proctors do not use Email because they are stored as algorithm records, not people.

The submit flow sends one payload to the backend and the backend writes both the PROCTOR base row and the matching subtype row in the same transaction.

How data flows:

1. User clicks module
2. Frontend calls backend API
3. Backend runs SQL query
4. Oracle returns rows
5. Frontend renders rows

## 8) Clarification: SQL Commands vs HTTP Methods

Common confusion:

- INSERT, SELECT, UPDATE, DELETE are SQL commands (database side)
- GET, POST, PUT, DELETE are HTTP methods (web/API side)

Mapping used in this project:

- CREATE -> HTTP POST -> SQL INSERT
- READ -> HTTP GET -> SQL SELECT
- UPDATE -> HTTP PUT -> SQL UPDATE
- DELETE -> HTTP DELETE -> SQL DELETE

## 9) How to Run the Project (Step-by-Step)

1. Start Oracle XE and ensure listener is running.
2. Run sql/schema.sql in SQL Developer or APEX SQL Workshop.
3. Run sql/sample_data.sql (optional but recommended for demo).
4. Set backend/.env with correct DB values.
5. Start backend:

   cd backend
   npm install
   npm start

6. Open http://localhost:5000/ in the browser.

Verification tip:

- If you open the project from the root folder, `npm start` will fail because the root does not contain the backend `package.json`.
- Always start the server from `backend/`.

Quick test URLs:

- http://localhost:5000/api/health
- http://localhost:5000/
- http://localhost:5000/api/students

## 10) Demo Script for Evaluation

Use this simple order in live evaluation:

1. Show schema tables exist.
2. Open frontend Students page.
3. CREATE: add new student.
4. READ: search/filter student list.
5. UPDATE: edit student email/program.
6. DELETE: delete that student.
7. Repeat one quick CRUD on another table (Exams or Courses).
8. Show data persists after refresh.

## 11) Troubleshooting Guide

### Issue A: Service not registered (NJS-518 / XEPDB1)

Cause:

- Wrong Oracle service in DB_CONNECTION.

Fix:

- Use DB_CONNECTION=localhost:1521/XE for local XE 11g setup.

### Issue B: ORA-00942 table or view does not exist

Cause:

- Wrong schema context.

Fix:

- Set DB_SCHEMA=PROJECT (or actual owner schema).

### Issue C: Backend starts but UI shows empty tables

Cause:

- No data inserted yet.

Fix:

- Run sql/sample_data.sql.

### Issue D: Duplicate key errors on sample_data.sql

Cause:

- Script already inserted once.

Fix:

- Skip re-running or clear tables before reinsert.

### Issue E: Backend crashes with ORA-00904 on EXAM_SESSION

Cause:

- The live database schema is missing the `AttemptNo`, `StudentID`, or `ExamID` columns that the new routes use.

Fix:

- Apply the EXAM_SESSION migration so the live schema matches `sql/schema.sql`.

### Issue E: Cannot GET / in the browser

Cause:

- The app was opened from the filesystem instead of the backend HTTP server.

Fix:

- Open http://localhost:5000/ so Express serves the frontend directly.

## 12) EERD Fidelity Notes

Implementation follows EERD concepts:

- Weak entities modeled with composite keys
- Specialization represented by child tables
- M:N relationships represented by junction tables
- Constraints included for domains and participation behavior where practical

Documented practical simplification:

- Proctor role is captured through Role attribute in PROCTOR, while HUMAN_PROCTOR and AI_PROCTOR tables support the specialization structure.
- AI proctors are persisted as PROCTOR plus AI_PROCTOR so model metadata stays normalized and queryable.

Proctor schema detail:

- PROCTOR holds ProctorID, Name, Email, and Role.
- HUMAN_PROCTOR holds ProctorID and Designation.
- AI_PROCTOR holds ProctorID, AlgorithmVersion, and ModelName.
- The Role constraint now allows Faculty, TA, External, and AI.

## 13) Git and Commit History Summary

Work was committed in multiple logical steps (not one big commit), including:

1. Backend setup and Oracle connection
2. API route modules
3. Frontend dashboard
4. Oracle schema script
5. Sample data script
6. Documentation updates

This helps trace progress clearly for team collaboration.

Current workflow summary:

1. Run the backend from the backend folder.
2. Open http://localhost:5000/.
3. Use the sidebar to reach the new modules as well as Proctors.
4. Use the two-step wizard for Human or AI proctors.
5. Verify AI proctors create both PROCTOR and AI_PROCTOR rows.
6. Use the API health endpoint and the module tables to confirm the app is working end to end.

Current checked counts during validation:

- Students: 5
- Instructors: 4
- Departments: 3
- Courses: 4
- Exams: 4
- Question Banks: 4
- Questions: 10
- Answers: 17
- Exam Sessions: 6
- Notifications: 6
- Violation Categories: 5
- Student Phones: 7
- Proctors: 7
- Attempts: 6
- Results: 6
- Violations: 5

## 15) Final Note

This implementation was intentionally kept practical and beginner-friendly for a Database Systems Phase 2 evaluation. It demonstrates full CRUD, schema integrity, and web integration without overcomplicating SQL.
