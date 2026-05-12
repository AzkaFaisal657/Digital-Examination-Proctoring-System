-- ===========================
-- DEPARTMENTS
-- ===========================
INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty) VALUES ('DEPT001', 'Computer Science', 'Faculty of Computing');
INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty) VALUES ('DEPT002', 'Information Technology', 'Faculty of Computing');
INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty) VALUES ('DEPT003', 'Software Engineering', 'Faculty of Computing');

-- ===========================
-- COURSES
-- ===========================
INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID) VALUES ('CRS001', 'Database Systems', 3, 'Spring', 'DEPT001');
INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID) VALUES ('CRS002', 'Web Development', 3, 'Fall', 'DEPT002');
INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID) VALUES ('CRS003', 'Data Structures', 4, 'Spring', 'DEPT001');
INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID) VALUES ('CRS004', 'Software Design', 3, 'Fall', 'DEPT003');

-- ===========================
-- INSTRUCTORS
-- ===========================
INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization) VALUES ('INS001', 'Amina', 'Khan', 'amina.khan@example.com', 'Lecturer', 'Databases');
INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization) VALUES ('INS002', 'Bilal', 'Ahmed', 'bilal.ahmed@example.com', 'Assistant Professor', 'Web Technologies');
INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization) VALUES ('INS003', 'Fatima', 'Hassan', 'fatima.hassan@example.com', 'Associate Professor', 'Data Structures');
INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization) VALUES ('INS004', 'Omar', 'Farooq', 'omar.farooq@example.com', 'Lecturer', 'Software Architecture');

-- ===========================
-- STUDENTS
-- ===========================
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB) VALUES ('STU001', 'Ali', 'Raza', 'REG001', 'ali.raza@example.com', 'BSCS', 2023, TO_DATE('2004-05-14', 'YYYY-MM-DD'));
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB) VALUES ('STU002', 'Sara', 'Malik', 'REG002', 'sara.malik@example.com', 'BSIT', 2022, TO_DATE('2003-11-02', 'YYYY-MM-DD'));
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB) VALUES ('STU003', 'Hassan', 'Iqbal', 'REG003', 'hassan.iqbal@example.com', 'BSCS', 2023, TO_DATE('2004-01-20', 'YYYY-MM-DD'));
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB) VALUES ('STU004', 'Zainab', 'Ahmed', 'REG004', 'zainab.ahmed@example.com', 'BSIT', 2023, TO_DATE('2004-08-09', 'YYYY-MM-DD'));
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB) VALUES ('STU005', 'Muhammad', 'Khan', 'REG005', 'm.khan@example.com', 'BSCS', 2022, TO_DATE('2003-03-15', 'YYYY-MM-DD'));

-- ===========================
-- STUDENT PHONES
-- ===========================
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU001', '+92-300-1111111');
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU001', '+92-300-2222222');
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU002', '+92-300-3333333');
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU003', '+92-300-4444444');
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU004', '+92-300-5555555');
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo) VALUES ('STU005', '+92-300-7777777');

-- ===========================
-- EXAMS
-- ===========================
INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID) VALUES ('EX001', 'DB Midterm', 60, 50, TO_DATE('2026-04-20', 'YYYY-MM-DD'), 'MCQ', 1, 'CRS001', 'INS001');
INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID) VALUES ('EX002', 'Web Final', 90, 75, TO_DATE('2026-04-22', 'YYYY-MM-DD'), 'Mixed', 2, 'CRS002', 'INS002');
INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID) VALUES ('EX003', 'DS Quiz', 30, 30, TO_DATE('2026-05-01', 'YYYY-MM-DD'), 'MCQ', 1, 'CRS003', 'INS003');
INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID) VALUES ('EX004', 'Software Design Assignment', 120, 100, TO_DATE('2026-05-10', 'YYYY-MM-DD'), 'Subjective', 3, 'CRS004', 'INS004');

-- ===========================
-- QUESTION BANKS
-- ===========================
INSERT INTO QUESTION_BANK (BankID, BankName, Subject, InstructorID) VALUES ('QB001', 'DB Fundamentals Bank', 'Database Systems', 'INS001');
INSERT INTO QUESTION_BANK (BankID, BankName, Subject, InstructorID) VALUES ('QB002', 'Web Technologies Bank', 'Web Development', 'INS002');
INSERT INTO QUESTION_BANK (BankID, BankName, Subject, InstructorID) VALUES ('QB003', 'Data Structures Bank', 'Data Structures', 'INS003');
INSERT INTO QUESTION_BANK (BankID, BankName, Subject, InstructorID) VALUES ('QB004', 'Design Patterns Bank', 'Software Design', 'INS004');

-- ===========================
-- QUESTIONS
-- ===========================
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST001', 'What is a primary key?', 'Easy', 5, 'QB001');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST002', 'Explain normalization and its types.', 'Medium', 10, 'QB001');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST003', 'Define ACID properties.', 'Hard', 15, 'QB001');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST004', 'What is HTML?', 'Easy', 5, 'QB002');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST005', 'Differentiate between HTML and XHTML.', 'Medium', 10, 'QB002');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST006', 'What is a tree data structure?', 'Easy', 5, 'QB003');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST007', 'Explain binary search tree properties.', 'Medium', 10, 'QB003');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST008', 'Describe the MVC design pattern.', 'Medium', 15, 'QB004');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST009', 'What are design patterns?', 'Easy', 5, 'QB004');
INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID) VALUES ('QST010', 'Compare singleton and factory patterns.', 'Hard', 20, 'QB004');

-- ===========================
-- MCQ QUESTIONS
-- ===========================
INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount) VALUES ('QST001', 1);
INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount) VALUES ('QST004', 1);
INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount) VALUES ('QST006', 1);
INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount) VALUES ('QST009', 1);

-- ===========================
-- SUBJECTIVE QUESTIONS
-- ===========================
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST002', 250, 'Normalization reduces redundancy. Types: 1NF, 2NF, 3NF, BCNF');
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST003', 300, 'ACID: Atomicity, Consistency, Isolation, Durability');
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST005', 250, 'HTML is loose syntax, XHTML is strict XML-based version');
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST007', 300, 'BST: left < node < right, O(log n) search when balanced');
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST008', 350, 'MVC: Model, View, Controller - separates concerns');
INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer) VALUES ('QST010', 400, 'Singleton: one global instance. Factory: creates objects without specifying class');

-- ===========================
-- ANSWERS
-- ===========================
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST001', 'A', 'Unique identifier for a record', 'Y');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST001', 'B', 'Foreign key reference', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST001', 'C', 'Index on a table', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST001', 'D', 'Constraint on data', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST004', 'A', 'Markup language for web pages', 'Y');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST004', 'B', 'Programming language', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST004', 'C', 'Database query language', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST004', 'D', 'Server-side scripting', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST006', 'A', 'Non-linear hierarchical structure', 'Y');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST006', 'B', 'Linear sequential structure', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST006', 'C', 'Circular linked structure', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST006', 'D', 'Graph-only structure', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST009', 'A', 'Reusable solutions to common problems', 'Y');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST009', 'B', 'Coding bugs', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST009', 'C', 'Test frameworks', 'N');
INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect) VALUES ('QST009', 'D', 'Version control systems', 'N');

-- ===========================
-- PROCTORS (no Email column in PROCTOR table)
-- ===========================
INSERT INTO PROCTOR (ProctorID, Name, Role) VALUES ('PRO001', 'Dr. Nida Nasir', 'Faculty');
INSERT INTO PROCTOR (ProctorID, Name, Role) VALUES ('PRO002', 'Arslan Khan', 'TA');
INSERT INTO PROCTOR (ProctorID, Name, Role) VALUES ('PRO003', 'AI Invigilator v1', 'AI');
INSERT INTO PROCTOR (ProctorID, Name, Role) VALUES ('PRO004', 'External Examiner', 'External');
INSERT INTO PROCTOR (ProctorID, Name, Role) VALUES ('PRO005', 'AI Invigilator v2', 'AI');

INSERT INTO HUMAN_PROCTOR (ProctorID, Email, Designation) VALUES ('PRO001', 'nida@example.com', 'Associate Professor');
INSERT INTO HUMAN_PROCTOR (ProctorID, Email, Designation) VALUES ('PRO002', 'arslan@example.com', 'Teaching Assistant');
INSERT INTO HUMAN_PROCTOR (ProctorID, Email, Designation) VALUES ('PRO004', 'examiner@example.com', 'University Examiner');

INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName) VALUES ('PRO003', 'v1.2.0', 'VisionProctorNet');
INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName) VALUES ('PRO005', 'v2.1.5', 'ProctorAI-Advanced');

-- ===========================
-- VIOLATION CATEGORIES
-- ===========================
INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES ('CAT001', 'Tab Switch', 'Medium');
INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES ('CAT002', 'Face Not Detected', 'High');
INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES ('CAT003', 'Multiple Faces', 'High');
INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES ('CAT004', 'Copy-Paste Attempt', 'Medium');
INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity) VALUES ('CAT005', 'Noise Detection', 'Low');

-- ===========================
-- ATTEMPTS
-- ===========================
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (1, 'STU001', 'EX001', SYSDATE, 'Completed');
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (1, 'STU002', 'EX001', SYSDATE, 'Completed');
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (1, 'STU003', 'EX001', SYSDATE, 'Completed');
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (1, 'STU004', 'EX002', SYSDATE, 'Completed');
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (2, 'STU004', 'EX002', SYSDATE, 'Completed');
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status) VALUES (1, 'STU005', 'EX003', SYSDATE, 'Completed');

-- ===========================
-- EXAM SESSIONS
-- ===========================
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES001', 1, 'STU001', 'EX001', SYSTIMESTAMP - INTERVAL '1' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.10', 'Chrome/120');
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES002', 1, 'STU002', 'EX001', SYSTIMESTAMP - INTERVAL '50' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.11', 'Firefox/115');
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES003', 1, 'STU003', 'EX001', SYSTIMESTAMP - INTERVAL '45' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.12', 'Safari/17');
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES004', 1, 'STU004', 'EX002', SYSTIMESTAMP - INTERVAL '2' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.13', 'Chrome/120');
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES005', 2, 'STU004', 'EX002', SYSTIMESTAMP - INTERVAL '1' HOUR, SYSTIMESTAMP, 'Completed', '192.168.1.14', 'Edge/120');
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo) VALUES ('SES006', 1, 'STU005', 'EX003', SYSTIMESTAMP - INTERVAL '25' MINUTE, SYSTIMESTAMP, 'Completed', '192.168.1.15', 'Chrome/120');

-- ===========================
-- VIOLATIONS
-- ===========================
INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID) VALUES ('VIO001', 'SES001', 'Medium', 'Student switched tabs once.', 'http://evidence.example.com/v01.mp4', 'CAT001');
INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID) VALUES ('VIO002', 'SES002', 'High', 'Face not detected for 2 minutes.', 'http://evidence.example.com/v02.mp4', 'CAT002');
INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID) VALUES ('VIO003', 'SES004', 'High', 'Multiple faces detected in frame.', 'http://evidence.example.com/v03.mp4', 'CAT003');
INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID) VALUES ('VIO004', 'SES004', 'Low', 'Background noise detected.', 'http://evidence.example.com/v04.mp4', 'CAT005');
INSERT INTO VIOLATION (ViolationID, SessionID, Severity, Description, EvidenceURL, CategoryID) VALUES ('VIO005', 'SES005', 'Medium', 'Suspicious copy-paste activity.', 'http://evidence.example.com/v05.mp4', 'CAT004');

-- ===========================
-- RESULTS
-- ===========================
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES001', 1, 'STU001', 'EX001', 45, 'A', 'Pass', SYSDATE);
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES002', 1, 'STU002', 'EX001', 32, 'B', 'Pass', SYSDATE);
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES003', 1, 'STU003', 'EX001', 28, 'C', 'Pass', SYSDATE);
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES004', 1, 'STU004', 'EX002', 65, 'A', 'Pass', SYSDATE);
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES005', 2, 'STU004', 'EX002', 72, 'A', 'Pass', SYSDATE);
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate) VALUES ('RES006', 1, 'STU005', 'EX003', 27, 'A', 'Pass', SYSDATE);

-- ===========================
-- NOTIFICATIONS
-- ===========================
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF001', 'STU001', 'DB Midterm result published. Score: 45/50', 'Result', 'N');
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF002', 'STU002', 'Reminder: Web Final exam on April 22.', 'Reminder', 'N');
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF003', 'STU004', 'Violation alert: Multiple faces detected in SES004.', 'Violation Alert', 'N');
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF004', 'STU005', 'DS Quiz result published. Score: 27/30', 'Result', 'N');
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF005', 'STU001', 'Congratulations! DB Midterm Grade A.', 'Result', 'Y');
INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, IsRead) VALUES ('NTF006', 'STU003', 'Your exam session has been recorded for review.', 'Reminder', 'Y');

-- ===========================
-- ENROLLMENTS
-- ===========================
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU001', 'CRS001');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU002', 'CRS001');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU003', 'CRS001');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU004', 'CRS002');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU005', 'CRS003');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU001', 'CRS003');
INSERT INTO ENROLLED_IN (StudentID, CourseID) VALUES ('STU004', 'CRS004');

-- ===========================
-- TEACHES
-- ===========================
INSERT INTO TEACHES (InstructorID, CourseID) VALUES ('INS001', 'CRS001');
INSERT INTO TEACHES (InstructorID, CourseID) VALUES ('INS002', 'CRS002');
INSERT INTO TEACHES (InstructorID, CourseID) VALUES ('INS003', 'CRS003');
INSERT INTO TEACHES (InstructorID, CourseID) VALUES ('INS004', 'CRS004');

-- ===========================
-- DRAWS_FROM
-- ===========================
INSERT INTO DRAWS_FROM (ExamID, BankID) VALUES ('EX001', 'QB001');
INSERT INTO DRAWS_FROM (ExamID, BankID) VALUES ('EX002', 'QB002');
INSERT INTO DRAWS_FROM (ExamID, BankID) VALUES ('EX003', 'QB003');
INSERT INTO DRAWS_FROM (ExamID, BankID) VALUES ('EX004', 'QB004');

-- ===========================
-- INCLUDED_IN
-- ===========================
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX001', 'QST001');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX001', 'QST002');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX002', 'QST004');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX002', 'QST005');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX003', 'QST006');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX003', 'QST007');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX004', 'QST008');
INSERT INTO INCLUDED_IN (ExamID, QuestionID) VALUES ('EX004', 'QST010');

-- ===========================
-- MONITORED_BY
-- ===========================
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES001', 'PRO001');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES001', 'PRO003');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES002', 'PRO002');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES002', 'PRO003');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES003', 'PRO001');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES003', 'PRO005');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES004', 'PRO002');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES004', 'PRO003');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES005', 'PRO001');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES005', 'PRO005');
INSERT INTO MONITORED_BY (SessionID, ProctorID) VALUES ('SES006', 'PRO004');

COMMIT;