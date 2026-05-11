# Viva Demo & Cascade Delete Guide

## Part 1: Complete Deletion Cascade Demo for Your Viva

### Scenario: Create and Delete a Student with All Related Data

**This demonstrates data integrity and FK constraint handling.**

---

### Step 1: Insert a test student

```sql
INSERT INTO STUDENT (StudentID, FirstName, LastName, RegNo, Email, Program, BatchYear, DOB)
VALUES ('TEST001', 'Deletion', 'Demo', 'REG999', 'test@demo.edu', 'BSCS', 2025, TO_DATE('2005-01-15', 'YYYY-MM-DD'));
COMMIT;
```

**What this does:** Creates a base STUDENT record.

---

### Step 2: Add test phone for that student (child record)

```sql
INSERT INTO STUDENT_PHONE (StudentID, PhoneNo)
VALUES ('TEST001', '03001234567');
COMMIT;
```

**What this does:** Adds a multivalued attribute (phone number) linked to the student via FK.

---

### Step 3: Enroll the student in a course (child record)

```sql
INSERT INTO ENROLLED_IN (StudentID, CourseID)
VALUES ('TEST001', 'CS101');
COMMIT;
```

**What this does:** Creates an M:N relationship between STUDENT and COURSE.

---

### Step 4: Create an exam attempt for that student (related via ATTEMPT)

```sql
INSERT INTO ATTEMPT (AttemptNo, StudentID, ExamID, AttemptDate, Status)
VALUES (1, 'TEST001', 'EX001', SYSDATE, 'Completed');
COMMIT;
```

**What this does:** Creates a weak entity ATTEMPT (composite key: AttemptNo + StudentID + ExamID) linked to the student.

---

### Step 5: Create a result for that attempt (child of ATTEMPT)

```sql
INSERT INTO RESULT (ResultID, AttemptNo, StudentID, ExamID, MarksObtained, Grade, Status, PublishedDate)
VALUES ('RES001', 1, 'TEST001', 'EX001', 85.5, 'A', 'Pass', SYSDATE);
COMMIT;
```

**What this does:** Creates a RESULT record (depends on ATTEMPT via FK).

---

### Step 6: Create an exam session for that student (related record)

```sql
INSERT INTO EXAM_SESSION (SessionID, AttemptNo, StudentID, ExamID, StartTime, EndTime, Status)
VALUES ('SES001', 1, 'TEST001', 'EX001', SYSDATE - 1, SYSDATE, 'Completed');
COMMIT;
```

**What this does:** Creates an EXAM_SESSION record linked to student and attempt.

---

### Step 7: Verify all data exists

```sql
SELECT * FROM STUDENT WHERE StudentID = 'TEST001';
SELECT * FROM STUDENT_PHONE WHERE StudentID = 'TEST001';
SELECT * FROM ENROLLED_IN WHERE StudentID = 'TEST001';
SELECT * FROM ATTEMPT WHERE StudentID = 'TEST001';
SELECT * FROM RESULT WHERE StudentID = 'TEST001';
SELECT * FROM EXAM_SESSION WHERE StudentID = 'TEST001';
```

**Expected:** All queries return rows showing the complete hierarchy of test data.

---

## Part 2: Delete Flow Through the Browser UI

### How to Delete Through the Dashboard

1. **Go to Students tab** in the sidebar
2. **Search for** `TEST001` in the search bar
3. **Find the row** with StudentID=TEST001
4. **Click Delete button** (red button on the right)
5. **Confirm the deletion** in the popup

**What happens:**
- If you try to delete directly, you'll get an **FK constraint error** because STUDENT_PHONE, ENROLLED_IN, ATTEMPT, EXAM_SESSION all reference the student.
- The deletion will **fail**.
- This is expected behavior — it protects data integrity.

### Correct Deletion Order Through UI

Since the UI only deletes one record at a time and respects FK constraints, you must delete in this order:

#### Step 1: Delete Student Phones
- Go to **Student Phones** tab
- Search for `StudentID = TEST001`
- Delete each phone record individually
- Result: STUDENT_PHONE records deleted

#### Step 2: Delete Exam Sessions
- Go to **Exam Sessions** tab
- Filter or search for `StudentID = TEST001`
- Delete each session individually
- Result: EXAM_SESSION records deleted, but RESULT still references the ATTEMPT

#### Step 3: Delete Results
- Go to **Results** tab
- Filter or search for `StudentID = TEST001`
- Delete each result individually
- Result: RESULT records deleted (they were blocking ATTEMPT deletion)

#### Step 4: Delete Attempts
- Go to **Attempts** tab
- Filter or search for `StudentID = TEST001`
- Delete each attempt individually
- Result: ATTEMPT records deleted (weak entity is now gone)

#### Step 5: Delete Enrollments
- Go to **Enrolled In** tab (if shown in UI)
- Search for `StudentID = TEST001`
- Delete each enrollment individually
- Result: ENROLLED_IN records deleted

#### Step 6: Finally, Delete Student
- Go back to **Students** tab
- Search for `TEST001`
- Click **Delete**
- **Success!** Student is now deleted, along with all child data

---

## Part 3: Viva Explanation

### What to Say During Viva

**Evaluator:** "How do you handle deleting a student when they have related records?"

**You say:**

*"The deletion order matters because of foreign key constraints. The database ensures referential integrity by preventing deletion of parent records when child records still reference them.*

*In this example with student TEST001, the deletion hierarchy is:*

1. *RESULT depends on ATTEMPT, so I delete RESULT first.*
2. *ATTEMPT is a weak entity that depends on STUDENT, so I delete ATTEMPT next.*
3. *STUDENT_PHONE, EXAM_SESSION, and ENROLLED_IN all have FK references to STUDENT, so I delete these.*
4. *Finally, I delete the STUDENT record.*

*The backend handles this using transactions — if any delete fails, we ROLLBACK to prevent partial deletion. This is why the UI requires users to delete in the correct order: it respects the FK constraints and prevents orphaned records.*

*The database schema automatically enforces these rules, ensuring data consistency."*

---

### Key Points to Demonstrate

- **Show the test data:** Run SELECT queries to prove the hierarchy exists
- **Try incorrect delete first:** Try deleting STUDENT before deleting children (show the error)
- **Explain the FK:** Point to schema and show `CONSTRAINT fk_...`  
- **Complete the cascade:** Delete in correct order, verify each step
- **Show final state:** Query the empty tables to confirm all data is gone

---

## Part 4: Subjective Answers vs MCQ Answers

### Two Separate Answer Types

Now in the UI you have:

#### **Answers Tab** (MCQ Answers)
- Fields: QuestionID, OptionLabel, AnswerText, IsCorrect
- Shows: A, B, C, D options for multiple-choice questions
- Example: Q01 Option A = "Primary key uniquely identifies a record" (IsCorrect: Y)

#### **Subjective Answers Tab** (NEW)
- Fields: QuestionID, QuestionText, ModelAnswer, WordLimit
- Shows: Model answer and word limit for subjective questions
- Example: Q02 ModelAnswer = "Normalization is the process of reducing redundancy..." (WordLimit: 500)

### How to Use Subjective Answers Tab

1. **Go to Questions tab** → Add a subjective question (don't fill ModelAnswer there anymore)
2. **Go to Subjective Answers tab** (new)
3. **Click Add Subjective Answer**
4. **Fill in:**
   - QuestionID: (the question you just created)
   - ModelAnswer: (the expected answer)
   - WordLimit: (max words allowed for student answer)
5. **Save**
6. **View/Edit/Delete** model answers anytime in the Subjective Answers tab

---

## SQL Verification Commands (For Viva)

After completing the cascade delete:

```sql
-- Count all records to show hierarchy existed
SELECT COUNT(*) as "Total Students" FROM STUDENT WHERE StudentID LIKE 'TEST%';
SELECT COUNT(*) as "Total Phones" FROM STUDENT_PHONE WHERE StudentID LIKE 'TEST%';
SELECT COUNT(*) as "Total Enrollments" FROM ENROLLED_IN WHERE StudentID LIKE 'TEST%';
SELECT COUNT(*) as "Total Attempts" FROM ATTEMPT WHERE StudentID LIKE 'TEST%';
SELECT COUNT(*) as "Total Results" FROM RESULT WHERE StudentID LIKE 'TEST%';
SELECT COUNT(*) as "Total Sessions" FROM EXAM_SESSION WHERE StudentID LIKE 'TEST%';

-- After deletion, all should return 0
```

---

## Quick Reference: Schema & FKs

```
STUDENT ── 1 ──< STUDENT_PHONE (multivalued attribute)
          ├─ 1 ──< ENROLLED_IN (M:N junction)
          └─ 1 ──< ATTEMPT (weak entity)
                    └─ 1 ──< RESULT
                    └─ 1 ──< EXAM_SESSION

Deletion order (reverse of creation):
RESULT → EXAM_SESSION → ATTEMPT → ENROLLED_IN → STUDENT_PHONE → STUDENT
```

---

## Summary

- **Cascade Delete = safe hierarchical deletion** respecting FK constraints
- **UI enforces this** by requiring deletion in correct order
- **Backend transactions ensure atomicity** — all or nothing
- **Subjective Answers = new tab** for model answers (separate from MCQ Answers)
- **Two answer types now visible:** Answers (MCQ options) + Subjective Answers (model answers)
