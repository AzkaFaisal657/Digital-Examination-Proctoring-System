-- Sample data for Digital Examination & Proctoring System
-- Run this after schema.sql

-- ===========================
-- DEPARTMENTS
-- ===========================

INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
VALUES ('D01', 'Computer Science', 'Faculty of Computing');

INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
VALUES ('D02', 'Information Technology', 'Faculty of Computing');

INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
VALUES ('D03', 'Software Engineering', 'Faculty of Computing');

-- ===========================
-- COURSES
-- ===========================

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C01', 'Database Systems', 3, 'Spring', 'D01');

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C02', 'Web Development', 3, 'Fall', 'D02');

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C03', 'Data Structures', 4, 'Spring', 'D01');

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C04', 'Software Design', 3, 'Fall', 'D03');

-- ===========================
-- INSTRUCTORS
-- ===========================

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I01', 'Amina', 'Khan', 'amina.khan@example.com', 'Lecturer', 'Databases');

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I02', 'Bilal', 'Ahmed', 'bilal.ahmed@example.com', 'Assistant Professor', 'Web Technologies');

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I03', 'Fatima', 'Hassan', 'fatima.hassan@example.com', 'Associate Professor', 'Data Structures');

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I04', 'Omar', 'Farooq', 'omar.farooq@example.com', 'Lecturer', 'Software Architecture');

-- ===========================
-- STUDENTS
-- ===========================

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S01', 'Ali', 'Raza', 'REG001', 'ali.raza@example.com', 'BSCS', 2023, TO_DATE('2004-05-14', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S02', 'Sara', 'Malik', 'REG002', 'sara.malik@example.com', 'BSIT', 2022, TO_DATE('2003-11-02', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S03', 'Hassan', 'Iqbal', 'REG003', 'hassan.iqbal@example.com', 'BSCS', 2023, TO_DATE('2004-01-20', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S04', 'Zainab', 'Ahmed', 'REG004', 'zainab.ahmed@example.com', 'BSIT', 2023, TO_DATE('2004-08-09', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S05', 'Muhammad', 'Khan', 'REG005', 'm.khan@example.com', 'BSCS', 2022, TO_DATE('2003-03-15', 'YYYY-MM-DD'));

-- ===========================
-- STUDENT PHONES
-- ===========================

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S01', '+92-300-1111111');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S01', '+92-300-2222222');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S02', '+92-300-3333333');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S03', '+92-300-4444444');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S04', '+92-300-5555555');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S04', '+92-300-6666666');

INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('S05', '+92-300-7777777');

-- ===========================
-- EXAMS
-- ===========================

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E01', 'DB Midterm', 60, 50, TO_DATE('2026-04-20', 'YYYY-MM-DD'), 'MCQ', 1, 'C01', 'I01');

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E02', 'Web Final', 90, 75, TO_DATE('2026-04-22', 'YYYY-MM-DD'), 'Mixed', 2, 'C02', 'I02');

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E03', 'DS Quiz', 30, 30, TO_DATE('2026-05-01', 'YYYY-MM-DD'), 'MCQ', 1, 'C03', 'I03');

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E04', 'Software Design Assignment', 120, 100, TO_DATE('2026-05-10', 'YYYY-MM-DD'), 'Subjective', 3, 'C04', 'I04');

-- ===========================
-- QUESTION BANKS
-- ===========================

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B01', 'DB Fundamentals Bank', 'Database Systems', SYSDATE, 'I01');

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B02', 'Web Technologies Bank', 'Web Development', SYSDATE, 'I02');

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B03', 'Data Structures Bank', 'Data Structures & Algorithms', SYSDATE, 'I03');

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B04', 'Design Patterns Bank', 'Software Design', SYSDATE, 'I04');

-- ===========================
-- QUESTIONS
-- ===========================

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q01', 'What is a primary key?', 'Easy', 5, 'B01');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q02', 'Explain normalization and its types.', 'Medium', 10, 'B01');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q03', 'Define ACID properties.', 'Hard', 15, 'B01');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q04', 'What is HTML?', 'Easy', 5, 'B02');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q05', 'Differentiate between HTML and XHTML.', 'Medium', 10, 'B02');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q06', 'What is a tree data structure?', 'Easy', 5, 'B03');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q07', 'Explain binary search tree properties.', 'Medium', 10, 'B03');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q08', 'Describe the MVC design pattern.', 'Medium', 15, 'B04');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q09', 'What are design patterns?', 'Easy', 5, 'B04');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q10', 'Compare singleton and factory patterns.', 'Hard', 20, 'B04');

-- ===========================
-- MCQ QUESTIONS
-- ===========================

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q01', 1);

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q04', 1);

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q06', 1);

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q09', 1);

-- ===========================
-- SUBJECTIVE QUESTIONS
-- ===========================

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q02', 250, 'Normalization is the process of organizing data to reduce redundancy. Types: 1NF, 2NF, 3NF, BCNF');

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q03', 300, 'ACID: Atomicity (all-or-none), Consistency (valid states), Isolation (concurrent), Durability (permanent)');

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q05', 250, 'HTML is markup language with loose syntax. XHTML is stricter XML-based version with strict rules.');

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q07', 300, 'BST: left subtree < node < right subtree, provides O(log n) search in balanced state');

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q08', 350, 'MVC: Model (data), View (UI), Controller (logic) - separates concerns, improves maintainability');

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q10', 400, 'Singleton: one instance globally. Factory: creates objects without specifying exact classes. Both are creational.');

-- ===========================
-- ANSWERS (MCQ Options)
-- ===========================

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'A', 'Unique identifier for a record', 'Y');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'B', 'Foreign key reference', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'C', 'Index on a table', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'D', 'Constraint on data', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q04', 'A', 'Markup language for web pages', 'Y');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q04', 'B', 'Programming language', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q04', 'C', 'Database query language', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q04', 'D', 'Server-side scripting', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q06', 'A', 'Non-linear hierarchical structure', 'Y');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q06', 'B', 'Linear sequential structure', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q06', 'C', 'Circular linked structure', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q06', 'D', 'Graph-only structure', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q09', 'A', 'Reusable solutions to common problems', 'Y');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q09', 'B', 'Coding bugs', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q09', 'C', 'Test frameworks', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q09', 'D', 'Version control systems', 'N');

-- ===========================
-- PROCTORS
-- ===========================

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P01', 'Dr. Nida Nasir', 'nida@example.com', 'Faculty');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P02', 'Arslan Khan', 'arslan@example.com', 'TA');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P03', 'AI Invigilator v1', NULL, 'AI');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P04', 'External Examiner', 'examiner@example.com', 'External');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P05', 'AI Invigilator v2', NULL, 'AI');

-- ===========================
-- HUMAN PROCTORS
-- ===========================

INSERT INTO HUMAN_PROCTOR (ProctorID, Designation)
VALUES ('P01', 'Associate Professor');

INSERT INTO HUMAN_PROCTOR (ProctorID, Designation)
VALUES ('P02', 'Teaching Assistant');

INSERT INTO HUMAN_PROCTOR (ProctorID, Designation)
VALUES ('P04', 'University Examiner');

-- ===========================
-- AI PROCTORS
-- ===========================

INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName)
VALUES ('P03', 'v1.2.0', 'VisionProctorNet');

INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName)
VALUES ('P05', 'v2.1.5', 'ProctorAI-Advanced');

-- ===========================
-- VIOLATIONS CATEGORY
-- ===========================

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC01', 'Tab Switch', 'Medium');

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC02', 'Face Not Detected', 'High');

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC03', 'Multiple Faces', 'High');

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC04', 'Copy-Paste Attempt', 'Medium');

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC05', 'Noise Detection', 'Low');

-- ===========================
-- ATTEMPTS
-- ===========================

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S01', 'E01', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S02', 'E01', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S03', 'E01', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S04', 'E02', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (2, 'S04', 'E02', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S05', 'E03', SYSDATE, 'Completed');

-- ===========================
-- EXAM SESSIONS
-- ===========================

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS01', 1, 'S01', 'E01', SYSTIMESTAMP - INTERVAL '1' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.10', 'Chrome/120');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS02', 1, 'S02', 'E01', SYSTIMESTAMP - INTERVAL '50' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.11', 'Firefox/115');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS03', 1, 'S03', 'E01', SYSTIMESTAMP - INTERVAL '45' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.12', 'Safari/17');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS04', 1, 'S04', 'E02', SYSTIMESTAMP - INTERVAL '2' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.13', 'Chrome/120');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS05', 2, 'S04', 'E02', SYSTIMESTAMP - INTERVAL '1.5' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.14', 'Edge/120');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS06', 1, 'S05', 'E03', SYSTIMESTAMP - INTERVAL '25' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.15', 'Chrome/120');

-- ===========================
-- VIOLATIONS
-- ===========================

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V01', 'SS01', SYSTIMESTAMP - INTERVAL '50' MINUTE, 'Medium', 'Student switched tabs once.', 'http://evidence.example.com/v01.mp4', 'VC01');

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V02', 'SS02', SYSTIMESTAMP - INTERVAL '40' MINUTE, 'High', 'Face not detected for 2 minutes.', 'http://evidence.example.com/v02.mp4', 'VC02');

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V03', 'SS04', SYSTIMESTAMP - INTERVAL '100' MINUTE, 'High', 'Multiple faces detected in frame.', 'http://evidence.example.com/v03.mp4', 'VC03');

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V04', 'SS04', SYSTIMESTAMP - INTERVAL '95' MINUTE, 'Low', 'Background noise detected.', 'http://evidence.example.com/v04.mp4', 'VC05');

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V05', 'SS05', SYSTIMESTAMP - INTERVAL '60' MINUTE, 'Medium', 'Suspicious copy-paste activity.', 'http://evidence.example.com/v05.mp4', 'VC04');

-- ===========================
-- RESULTS
-- ===========================

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R01', 1, 'S01', 'E01', 45, 'A', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R02', 1, 'S02', 'E01', 32, 'B', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R03', 1, 'S03', 'E01', 28, 'C', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R04', 1, 'S04', 'E02', 65, 'A', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R05', 2, 'S04', 'E02', 72, 'A', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R06', 1, 'S05', 'E03', 27, 'A', 'Pass', SYSDATE);

-- ===========================
-- NOTIFICATIONS
-- ===========================

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N01', 'S01', 'Your DB Midterm exam result is now published. Score: 45/50', 'Result', SYSTIMESTAMP, 'N');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N02', 'S02', 'Reminder: Web Development Final exam is on April 22, 2026.', 'Reminder', SYSTIMESTAMP, 'N');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N03', 'S04', 'Violation alert: Multiple faces detected in your exam session SS04.', 'Violation Alert', SYSTIMESTAMP, 'N');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N04', 'S05', 'Your Data Structures quiz result is published. Score: 27/30', 'Result', SYSTIMESTAMP, 'N');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N05', 'S01', 'Congratulations! You passed DB Midterm with grade A.', 'Result', SYSTIMESTAMP - INTERVAL '1' HOUR, 'Y');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N06', 'S03', 'Your exam session has been recorded for proctoring review.', 'Reminder', SYSTIMESTAMP - INTERVAL '2' HOUR, 'Y');

-- ===========================
-- ENROLLMENT (M:N)
-- ===========================

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S01', 'C01');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S02', 'C01');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S03', 'C01');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S04', 'C02');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S05', 'C03');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S01', 'C03');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S04', 'C04');

-- ===========================
-- TEACHES (M:N)
-- ===========================

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I01', 'C01');

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I02', 'C02');

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I03', 'C03');

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I04', 'C04');

-- ===========================
-- DRAWS_FROM (M:N)
-- ===========================

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E01', 'B01');

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E02', 'B02');

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E03', 'B03');

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E04', 'B04');

-- ===========================
-- INCLUDED_IN (M:N)
-- ===========================

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E01', 'Q01');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E01', 'Q02');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E02', 'Q04');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E02', 'Q05');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E03', 'Q06');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E03', 'Q07');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E04', 'Q08');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E04', 'Q09');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E04', 'Q10');

-- ===========================
-- MONITORED_BY (M:N)
-- ===========================

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS01', 'P01');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS01', 'P03');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS02', 'P02');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS02', 'P03');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS03', 'P01');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS03', 'P05');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS04', 'P02');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS04', 'P03');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS05', 'P01');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS05', 'P05');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS06', 'P04');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS06', 'P03');

COMMIT;
