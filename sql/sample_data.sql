-- Sample data for Digital Examination & Proctoring System
-- Run this after schema.sql

INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
VALUES ('D01', 'Computer Science', 'Faculty of Computing');

INSERT INTO DEPARTMENT (DeptID, DeptName, Faculty)
VALUES ('D02', 'Information Technology', 'Faculty of Computing');

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C01', 'Database Systems', 3, 'Spring', 'D01');

INSERT INTO COURSE (CourseID, CourseTitle, CreditHours, Semester, DeptID)
VALUES ('C02', 'Web Development', 3, 'Fall', 'D02');

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I01', 'Amina', 'Khan', 'amina.khan@example.com', 'Lecturer', 'Databases');

INSERT INTO INSTRUCTOR (InstructorID, FirstName, LastName, Email, Designation, Specialization)
VALUES ('I02', 'Bilal', 'Ahmed', 'bilal.ahmed@example.com', 'Assistant Professor', 'Web Technologies');

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S01', 'Ali', 'Raza', 'REG001', 'ali.raza@example.com', 'BSCS', 2023, TO_DATE('2004-05-14', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S02', 'Sara', 'Malik', 'REG002', 'sara.malik@example.com', 'BSIT', 2022, TO_DATE('2003-11-02', 'YYYY-MM-DD'));

INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('S03', 'Hassan', 'Iqbal', 'REG003', 'hassan.iqbal@example.com', 'BSCS', 2023, TO_DATE('2004-01-20', 'YYYY-MM-DD'));

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E01', 'DB Midterm', 60, 50, TO_DATE('2026-04-20', 'YYYY-MM-DD'), 'MCQ', 1, 'C01', 'I01');

INSERT INTO EXAM (ExamID, Title, Duration, TotalMarks, ExamDate, Type, AllowedAttempts, CourseID, InstructorID)
VALUES ('E02', 'Web Final', 90, 75, TO_DATE('2026-04-22', 'YYYY-MM-DD'), 'Mixed', 2, 'C02', 'I02');

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B01', 'DB Bank', 'Database Systems', SYSDATE, 'I01');

INSERT INTO QUESTION_BANK (BankID, BankName, Subject, CreatedDate, InstructorID)
VALUES ('B02', 'Web Bank', 'Web Development', SYSDATE, 'I02');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q01', 'What is a primary key?', 'Easy', 5, 'B01');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q02', 'Explain normalization.', 'Medium', 10, 'B01');

INSERT INTO QUESTION (QuestionID, QuestionText, DifficultyLevel, Marks, BankID)
VALUES ('Q03', 'What is HTML?', 'Easy', 5, 'B02');

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q01', 1);

INSERT INTO SUBJECTIVE_QUESTION (QuestionID, WordLimit, ModelAnswer)
VALUES ('Q02', 200, 'Normalization reduces redundancy and improves data integrity.');

INSERT INTO MCQ_QUESTION (QuestionID, CorrectOptionCount)
VALUES ('Q03', 1);

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'A', 'Unique identifier', 'Y');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q01', 'B', 'Foreign key', 'N');

INSERT INTO ANSWER (QuestionID, OptionLabel, AnswerText, IsCorrect)
VALUES ('Q03', 'A', 'Markup language', 'Y');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P01', 'Dr. Nida', 'nida@example.com', 'Faculty');

INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
VALUES ('P02', 'Arslan', 'arslan@example.com', 'TA');

INSERT INTO HUMAN_PROCTOR (ProctorID, Designation)
VALUES ('P01', 'Associate Professor');

INSERT INTO HUMAN_PROCTOR (ProctorID, Designation)
VALUES ('P02', 'Teaching Assistant');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S01', 'E01', SYSDATE, 'Completed');

INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'S02', 'E01', SYSDATE, 'Completed');

INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status, IPAddress, BrowserInfo)
VALUES ('SS01', 1, 'S01', 'E01', SYSTIMESTAMP, SYSTIMESTAMP, 'Active', '127.0.0.1', 'Chrome');

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R01', 1, 'S01', 'E01', 45, 'A', 'Pass', SYSDATE);

INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('R02', 1, 'S02', 'E01', 32, 'B', 'Pass', SYSDATE);

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC01', 'Tab Switch', 'Medium');

INSERT INTO VIOLATION_CATEGORY (CategoryID, CategoryName, DefaultSeverity)
VALUES ('VC02', 'Face Not Detected', 'High');

INSERT INTO VIOLATION (ViolationID, SessionID, ViolationTimestamp, Severity, Description, EvidenceURL, CategoryID)
VALUES ('V01', 'SS01', SYSTIMESTAMP, 'Medium', 'Student switched tabs once.', 'http://example.com/evidence1', 'VC01');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N01', 'S01', 'Your DB Midterm result is published.', 'Result', SYSTIMESTAMP, 'N');

INSERT INTO NOTIFICATION (NotifID, StudentID, Message, Type, NotifTimestamp, IsRead)
VALUES ('N02', 'S02', 'Please review your exam violation record.', 'Violation Alert', SYSTIMESTAMP, 'N');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S01', 'C01');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S02', 'C01');

INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('S03', 'C02');

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I01', 'C01');

INSERT INTO TEACHES (InstructorID, CourseID)
VALUES ('I02', 'C02');

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E01', 'B01');

INSERT INTO DRAWS_FROM (ExamID, BankID)
VALUES ('E02', 'B02');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E01', 'Q01');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E01', 'Q02');

INSERT INTO INCLUDED_IN (ExamID, QuestionID)
VALUES ('E02', 'Q03');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS01', 'P01');

INSERT INTO MONITORED_BY (SessionID, ProctorID)
VALUES ('SS01', 'P02');

COMMIT;
