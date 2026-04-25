const oracledb = require("oracledb");
const fs = require("fs");
require("dotenv").config();

const defaultClientPath = "C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin";
const clientPath = process.env.ORACLE_CLIENT_LIB_DIR || defaultClientPath;

if (fs.existsSync(clientPath)) {
  try {
    oracledb.initOracleClient({ libDir: clientPath });
  } catch (error) {
    console.warn(`Oracle client init skipped: ${error.message}`);
  }
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

async function getConnection() {
  const connection = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION,
  });

  const schema = (process.env.DB_SCHEMA || process.env.DB_USER || "").toUpperCase();
  if (schema && /^[A-Z0-9_]+$/.test(schema)) {
    await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${schema}`);
  }

  return connection;
}

module.exports = { getConnection };
