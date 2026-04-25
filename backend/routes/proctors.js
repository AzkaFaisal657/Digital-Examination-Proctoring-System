const express = require("express");
const { getConnection } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ProctorID, Name, Email, Role
       FROM PROCTOR
       ORDER BY ProctorID`
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
    const { ProctorID, Name, Email, Role } = req.body;

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO PROCTOR (ProctorID, Name, Email, Role)
       VALUES (:ProctorID, :Name, :Email, :Role)`,
      { ProctorID, Name, Email, Role }
    );

    res.status(201).json({ message: "Proctor created successfully" });
  } catch (error) {
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
    const { Name, Email, Role } = req.body;

    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE PROCTOR
       SET Name = :Name,
           Email = :Email,
           Role = :Role
       WHERE ProctorID = :id`,
      { Name, Email, Role, id: req.params.id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Proctor not found" });
    }

    res.status(200).json({ message: "Proctor updated successfully" });
  } catch (error) {
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
