const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
          `SELECT p.ProctorID,
            p.Name,
            p.Role,
            NULL as Email,
            NULL as Designation,
            ap.AlgorithmVersion,
            ap.ModelName
           FROM PROCTOR p
           LEFT JOIN AI_PROCTOR ap ON ap.ProctorID = p.ProctorID
       ORDER BY p.ProctorID`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.post("/", async (req, res) => {
  let connection;
  try {
    const { ProctorID, Name, Email, Role, Designation, AlgorithmVersion, ModelName } = req.body;
    const isAIProctor = Role === "AI" || Boolean(AlgorithmVersion || ModelName);
    const effectiveRole = isAIProctor ? "AI" : Role;
    const emailValue = isAIProctor ? null : Email;

    console.log("POST /proctors - Received:", { ProctorID, Name, Email, Role, Designation, AlgorithmVersion, ModelName, isAIProctor });

    if (isAIProctor && (!AlgorithmVersion || !ModelName)) {
      return res.status(400).json({ error: "AlgorithmVersion and ModelName are required for AI proctors" });
    }

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO PROCTOR (ProctorID, Name, Role)
       VALUES (:ProctorID, :Name, :Role)`,
      { ProctorID, Name, Role: effectiveRole },
      { autoCommit: false }
    );
    console.log("✓ PROCTOR row inserted:", ProctorID);

    if (isAIProctor) {
      console.log("→ Inserting AI_PROCTOR:", { ProctorID, AlgorithmVersion, ModelName });
      await connection.execute(
        `INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName)
         VALUES (:ProctorID, :AlgorithmVersion, :ModelName)`,
        { ProctorID, AlgorithmVersion, ModelName },
        { autoCommit: false }
      );
      console.log("✓ AI_PROCTOR row inserted:", ProctorID);
    } else {
      console.log("→ Inserting HUMAN_PROCTOR:", { ProctorID, Email: emailValue, Designation });
      await connection.execute(
        `INSERT INTO HUMAN_PROCTOR (ProctorID, Email, Designation)
         VALUES (:ProctorID, :Email, :Designation)`,
        { ProctorID, Email: emailValue, Designation },
        { autoCommit: false }
      );
      console.log("✓ HUMAN_PROCTOR row inserted:", ProctorID);
    }

    await connection.commit();
    console.log("✓ Transaction committed for:", ProctorID);
    res.status(201).json({ message: "Proctor created successfully" });
  } catch (error) {
    console.error("✗ Error in POST /proctors:", error.message);
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { Name, Email, Role, Designation, AlgorithmVersion, ModelName } = req.body;
    const isAIProctor = Role === "AI" || Boolean(AlgorithmVersion || ModelName);
    const effectiveRole = isAIProctor ? "AI" : Role;
    const emailValue = isAIProctor ? null : Email;

    if (isAIProctor && (!AlgorithmVersion || !ModelName)) {
      return res.status(400).json({ error: "AlgorithmVersion and ModelName are required for AI proctors" });
    }

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE PROCTOR
       SET Name = :Name,
           Role = :Role
       WHERE ProctorID = :id`,
      { Name, Role: effectiveRole, id: req.params.id },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Proctor not found" });
    }

    await connection.execute(
      `DELETE FROM HUMAN_PROCTOR WHERE ProctorID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );
    await connection.execute(
      `DELETE FROM AI_PROCTOR WHERE ProctorID = :id`,
      { id: req.params.id },
      { autoCommit: false }
    );

    if (isAIProctor) {
      await connection.execute(
        `INSERT INTO AI_PROCTOR (ProctorID, AlgorithmVersion, ModelName)
         VALUES (:ProctorID, :AlgorithmVersion, :ModelName)`,
        { ProctorID: req.params.id, AlgorithmVersion, ModelName },
        { autoCommit: false }
      );
    } else {
      await connection.execute(
        `INSERT INTO HUMAN_PROCTOR (ProctorID, Email, Designation)
         VALUES (:ProctorID, :Email, :Designation)`,
        { ProctorID: req.params.id, Email: emailValue, Designation },
        { autoCommit: false }
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Proctor updated successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM PROCTOR WHERE ProctorID = :id`,
      { id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Proctor not found" });
    }

    res.status(200).json({ message: "Proctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
