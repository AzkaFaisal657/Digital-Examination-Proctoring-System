# Digital Examination & Proctoring System

Digital Examination & Proctoring System is a beginner-friendly full-stack database project for managing departments, courses, exams, students, attempts, results, proctors, and violations.

## Project Overview

This project includes:

- Oracle XE relational database schema based on EERD design.
- Node.js + Express backend APIs with Oracle connection using the oracledb package.
- Vanilla HTML/CSS/JS frontend dashboard with tables, search/filter, modals, and toast notifications.

## Tech Stack

- Database: Oracle XE
- Backend: Node.js, Express.js, oracledb, cors, dotenv
- Frontend: HTML, CSS, JavaScript (Vanilla)

## Folder Structure

```
Digital Examination & Proctoring System/
├── backend/
│   ├── routes/
│   │   ├── attempts.js
│   │   ├── courses.js
│   │   ├── departments.js
│   │   ├── exams.js
│   │   ├── proctors.js
│   │   ├── results.js
│   │   ├── students.js
│   │   └── violations.js
│   ├── .env
│   ├── db.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── sql/
│   └── schema.sql
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- Oracle XE installed and running
- SQL Developer (recommended)
- Git

## Oracle XE Connection Setup

Use these Oracle details:

- Username: system
- Host: localhost
- Port: 1521
- Service: XEPDB1

Set backend environment variables in backend/.env:

```
DB_USER=system
DB_PASSWORD=your_oracle_password
DB_CONNECTION=localhost:1521/XEPDB1
PORT=5000
```

## Database Setup Steps

1. Open SQL Developer and connect to Oracle XE using the credentials above.
2. Open sql/schema.sql.
3. Run the full script to create all project tables.
4. Optional: run sql/sample_data.sql to insert sample records for demo purposes.

## Backend Setup

From project root:

```
cd backend
npm install
npm start
```

Backend starts on:

```
http://localhost:5000
```

Health check endpoint:

```
GET http://localhost:5000/api/health
```

## Frontend Setup

The frontend is static (no framework).

Option 1 (simple):
- Open frontend/index.html directly in browser.

Option 2 (recommended):
- Use VS Code Live Server extension and run frontend/index.html.

Frontend connects to backend APIs at:

```
http://localhost:5000/api
```

## API Routes

Implemented modules:

- /api/students
- /api/exams
- /api/attempts
- /api/results
- /api/violations
- /api/proctors
- /api/departments
- /api/courses

Examples:

- Students: GET all, GET by ID, POST, PUT, DELETE
- Exams: GET all, GET by ID, POST, PUT, DELETE
- Attempts: GET all, POST, PUT, DELETE
- Results: GET all, POST, PUT, DELETE
- Violations: GET all, POST, DELETE
- Proctors: GET all, POST, PUT, DELETE
- Departments: GET all, POST, PUT, DELETE
- Courses: GET all, POST, PUT, DELETE

## Notes

- Oracle syntax is used (VARCHAR2, NUMBER, SYSDATE, SYSTIMESTAMP, TO_DATE).
- IDs are modeled as VARCHAR2 for simplicity.
- Some weak entity routes use composite keys in request body for update/delete operations.

## Git Ignore

The project excludes:

- node_modules/
- .env
- *.log

## License

MIT
