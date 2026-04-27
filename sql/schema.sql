-- Digital Examination & Proctoring System
-- =========================
-- 1) Strong Entities
-- =========================

CREATE TABLE DEPARTMENT (
    DeptID        VARCHAR2(20) PRIMARY KEY,
    DeptName      VARCHAR2(100) NOT NULL,
    Faculty       VARCHAR2(100)
);

CREATE TABLE COURSE (
    CourseID      VARCHAR2(20) PRIMARY KEY,
    CourseTitle   VARCHAR2(150) NOT NULL,
    CreditHours   NUMBER(2) NOT NULL,
    Semester      VARCHAR2(10) CHECK (Semester IN ('Fall', 'Spring', 'Summer')),
    DeptID        VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_course_department FOREIGN KEY (DeptID)
        REFERENCES DEPARTMENT(DeptID)
);

CREATE TABLE INSTRUCTOR (
    InstructorID   VARCHAR2(20) PRIMARY KEY,
    FirstName      VARCHAR2(50) NOT NULL,
    LastName       VARCHAR2(50) NOT NULL,
    Email          VARCHAR2(120) UNIQUE,
    Designation    VARCHAR2(100),
    Specialization VARCHAR2(120)
);

CREATE TABLE STUDENT (
    StudentID      VARCHAR2(20) PRIMARY KEY,
    FirstName      VARCHAR2(50) NOT NULL,
    LastName       VARCHAR2(50) NOT NULL,
    RegNo          VARCHAR2(50) UNIQUE,
    Email          VARCHAR2(120) UNIQUE,
    Program        VARCHAR2(100),
    BatchYear      NUMBER(4),
    DOB            DATE NOT NULL
);

CREATE TABLE EXAM (
    ExamID            VARCHAR2(20) PRIMARY KEY,
    Title             VARCHAR2(150) NOT NULL,
    Duration          NUMBER(4) NOT NULL,
    TotalMarks        NUMBER(5,2) NOT NULL,
    ExamDate          DATE,
    Type              VARCHAR2(20) CHECK (Type IN ('MCQ', 'Subjective', 'Mixed')),
    AllowedAttempts   NUMBER(2) DEFAULT 1,
    CourseID          VARCHAR2(20) NOT NULL,
    InstructorID      VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_exam_course FOREIGN KEY (CourseID)
        REFERENCES COURSE(CourseID),
    CONSTRAINT fk_exam_instructor FOREIGN KEY (InstructorID)
        REFERENCES INSTRUCTOR(InstructorID)
);

CREATE TABLE QUESTION_BANK (
    BankID         VARCHAR2(20) PRIMARY KEY,
    BankName       VARCHAR2(120) NOT NULL,
    Subject        VARCHAR2(120),
    CreatedDate    DATE DEFAULT SYSDATE,
    InstructorID   VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_qbank_instructor FOREIGN KEY (InstructorID)
        REFERENCES INSTRUCTOR(InstructorID)
);

CREATE TABLE QUESTION (
    QuestionID       VARCHAR2(20) PRIMARY KEY,
    QuestionText     VARCHAR2(1000) NOT NULL,
    DifficultyLevel  VARCHAR2(20) CHECK (DifficultyLevel IN ('Easy', 'Medium', 'Hard')),
    Marks            NUMBER(5,2) NOT NULL,
    BankID           VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_question_bank FOREIGN KEY (BankID)
        REFERENCES QUESTION_BANK(BankID)
);

CREATE TABLE PROCTOR (
    ProctorID     VARCHAR2(20) PRIMARY KEY,
    Name          VARCHAR2(120) NOT NULL,
    Email         VARCHAR2(120) UNIQUE,
    Role          VARCHAR2(20) CHECK (Role IN ('Faculty', 'TA', 'External', 'AI'))
);

CREATE TABLE EXAM_SESSION (
    SessionID      VARCHAR2(20) PRIMARY KEY,
    AttemptNo      NUMBER(3) NOT NULL,
    StudentID      VARCHAR2(20) NOT NULL,
    ExamID         VARCHAR2(20) NOT NULL,
    StartTime      TIMESTAMP,
    EndTime        TIMESTAMP,
    Status         VARCHAR2(20) CHECK (Status IN ('Active', 'Completed', 'Terminated')),
    IPAddress      VARCHAR2(50),
    BrowserInfo    VARCHAR2(200)
);

CREATE TABLE VIOLATION_CATEGORY (
    CategoryID        VARCHAR2(20) PRIMARY KEY,
    CategoryName      VARCHAR2(100) NOT NULL,
    DefaultSeverity   VARCHAR2(20) CHECK (DefaultSeverity IN ('Low', 'Medium', 'High'))
);

-- =========================
-- 2) Weak Entities
-- =========================

CREATE TABLE ANSWER (
    QuestionID     VARCHAR2(20) NOT NULL,
    OptionLabel    VARCHAR2(1) NOT NULL CHECK (OptionLabel IN ('A', 'B', 'C', 'D')),
    AnswerText     VARCHAR2(500) NOT NULL,
    IsCorrect      VARCHAR2(1) CHECK (IsCorrect IN ('Y', 'N')),
    PRIMARY KEY (QuestionID, OptionLabel),
    CONSTRAINT fk_answer_question FOREIGN KEY (QuestionID)
        REFERENCES QUESTION(QuestionID)
);

CREATE TABLE ATTEMPT (
    AttemptNo      NUMBER(3) NOT NULL,
    StudentID      VARCHAR2(20) NOT NULL,
    ExamID         VARCHAR2(20) NOT NULL,
    AttemptDate    DATE DEFAULT SYSDATE,
    Status         VARCHAR2(20) CHECK (Status IN ('Completed', 'Incomplete', 'Cancelled')),
    PRIMARY KEY (AttemptNo, StudentID, ExamID),
    CONSTRAINT fk_attempt_student FOREIGN KEY (StudentID)
        REFERENCES STUDENT(StudentID),
    CONSTRAINT fk_attempt_exam FOREIGN KEY (ExamID)
        REFERENCES EXAM(ExamID)
);

ALTER TABLE EXAM_SESSION
ADD CONSTRAINT uq_exam_session_attempt UNIQUE (AttemptNo, StudentID, ExamID);

ALTER TABLE EXAM_SESSION
ADD CONSTRAINT fk_session_attempt FOREIGN KEY (AttemptNo, StudentID, ExamID)
    REFERENCES ATTEMPT(AttemptNo, StudentID, ExamID);

CREATE TABLE RESULT (
    ResultID         VARCHAR2(20) NOT NULL,
    AttemptNo        NUMBER(3) NOT NULL,
    StudentID        VARCHAR2(20) NOT NULL,
    ExamID           VARCHAR2(20) NOT NULL,
    MarksObtained    NUMBER(6,2),
    Grade            VARCHAR2(5),
    Status           VARCHAR2(10) CHECK (Status IN ('Pass', 'Fail')),
    PublishedDate    DATE,
    PRIMARY KEY (ResultID, AttemptNo, StudentID),
    CONSTRAINT uq_result_attempt UNIQUE (AttemptNo, StudentID, ExamID),
    CONSTRAINT fk_result_attempt FOREIGN KEY (AttemptNo, StudentID, ExamID)
        REFERENCES ATTEMPT(AttemptNo, StudentID, ExamID),
    CONSTRAINT fk_result_exam FOREIGN KEY (ExamID)
        REFERENCES EXAM(ExamID)
);

CREATE TABLE VIOLATION (
    ViolationID         VARCHAR2(20) NOT NULL,
    SessionID           VARCHAR2(20) NOT NULL,
    ViolationTimestamp  TIMESTAMP DEFAULT SYSTIMESTAMP,
    Severity            VARCHAR2(20) CHECK (Severity IN ('Low', 'Medium', 'High')),
    Description         VARCHAR2(1000),
    EvidenceURL         VARCHAR2(300),
    CategoryID          VARCHAR2(20),
    PRIMARY KEY (ViolationID, SessionID),
    CONSTRAINT fk_violation_session FOREIGN KEY (SessionID)
        REFERENCES EXAM_SESSION(SessionID),
    CONSTRAINT fk_violation_category FOREIGN KEY (CategoryID)
        REFERENCES VIOLATION_CATEGORY(CategoryID)
);

CREATE TABLE NOTIFICATION (
    NotifID         VARCHAR2(20) NOT NULL,
    StudentID       VARCHAR2(20) NOT NULL,
    Message         VARCHAR2(500) NOT NULL,
    Type            VARCHAR2(30) CHECK (Type IN ('Reminder', 'Result', 'Violation Alert')),
    NotifTimestamp  TIMESTAMP DEFAULT SYSTIMESTAMP,
    IsRead          VARCHAR2(1) DEFAULT 'N' CHECK (IsRead IN ('Y', 'N')),
    PRIMARY KEY (NotifID, StudentID),
    CONSTRAINT fk_notification_student FOREIGN KEY (StudentID)
        REFERENCES STUDENT(StudentID)
);

-- =========================
-- 3) Specialization Tables
-- =========================

CREATE TABLE MCQ_QUESTION (
    QuestionID           VARCHAR2(20) PRIMARY KEY,
    CorrectOptionCount   NUMBER(2) NOT NULL,
    CONSTRAINT fk_mcq_question FOREIGN KEY (QuestionID)
        REFERENCES QUESTION(QuestionID)
);

CREATE TABLE SUBJECTIVE_QUESTION (
    QuestionID     VARCHAR2(20) PRIMARY KEY,
    WordLimit      NUMBER(5),
    ModelAnswer    VARCHAR2(2000),
    CONSTRAINT fk_subjective_question FOREIGN KEY (QuestionID)
        REFERENCES QUESTION(QuestionID)
);

CREATE TABLE HUMAN_PROCTOR (
    ProctorID      VARCHAR2(20) PRIMARY KEY,
    Designation    VARCHAR2(100),
    CONSTRAINT fk_human_proctor FOREIGN KEY (ProctorID)
        REFERENCES PROCTOR(ProctorID)
);

CREATE TABLE AI_PROCTOR (
    ProctorID           VARCHAR2(20) PRIMARY KEY,
    AlgorithmVersion    VARCHAR2(50),
    ModelName           VARCHAR2(100),
    CONSTRAINT fk_ai_proctor FOREIGN KEY (ProctorID)
        REFERENCES PROCTOR(ProctorID)
);

CREATE TABLE STUDENT_PHONE (
    StudentID      VARCHAR2(20) NOT NULL,
    PhoneNo        VARCHAR2(20) NOT NULL,
    PRIMARY KEY (StudentID, PhoneNo),
    CONSTRAINT fk_student_phone_student FOREIGN KEY (StudentID)
        REFERENCES STUDENT(StudentID)
);

-- =========================
-- 4) M:N Junction Tables
-- =========================

CREATE TABLE ENROLLED_IN (
    StudentID      VARCHAR2(20) NOT NULL,
    CourseID       VARCHAR2(20) NOT NULL,
    PRIMARY KEY (StudentID, CourseID),
    CONSTRAINT fk_enrolled_student FOREIGN KEY (StudentID)
        REFERENCES STUDENT(StudentID),
    CONSTRAINT fk_enrolled_course FOREIGN KEY (CourseID)
        REFERENCES COURSE(CourseID)
);

CREATE TABLE TEACHES (
    InstructorID   VARCHAR2(20) NOT NULL,
    CourseID       VARCHAR2(20) NOT NULL,
    PRIMARY KEY (InstructorID, CourseID),
    CONSTRAINT fk_teaches_instructor FOREIGN KEY (InstructorID)
        REFERENCES INSTRUCTOR(InstructorID),
    CONSTRAINT fk_teaches_course FOREIGN KEY (CourseID)
        REFERENCES COURSE(CourseID)
);

CREATE TABLE DRAWS_FROM (
    ExamID         VARCHAR2(20) NOT NULL,
    BankID         VARCHAR2(20) NOT NULL,
    PRIMARY KEY (ExamID, BankID),
    CONSTRAINT fk_draws_exam FOREIGN KEY (ExamID)
        REFERENCES EXAM(ExamID),
    CONSTRAINT fk_draws_bank FOREIGN KEY (BankID)
        REFERENCES QUESTION_BANK(BankID)
);

CREATE TABLE INCLUDED_IN (
    ExamID         VARCHAR2(20) NOT NULL,
    QuestionID     VARCHAR2(20) NOT NULL,
    PRIMARY KEY (ExamID, QuestionID),
    CONSTRAINT fk_included_exam FOREIGN KEY (ExamID)
        REFERENCES EXAM(ExamID),
    CONSTRAINT fk_included_question FOREIGN KEY (QuestionID)
        REFERENCES QUESTION(QuestionID)
);

CREATE TABLE MONITORED_BY (
    SessionID      VARCHAR2(20) NOT NULL,
    ProctorID      VARCHAR2(20) NOT NULL,
    PRIMARY KEY (SessionID, ProctorID),
    CONSTRAINT fk_monitored_session FOREIGN KEY (SessionID)
        REFERENCES EXAM_SESSION(SessionID),
    CONSTRAINT fk_monitored_proctor FOREIGN KEY (ProctorID)
        REFERENCES PROCTOR(ProctorID)
);
