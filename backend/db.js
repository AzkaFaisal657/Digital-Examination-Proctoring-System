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

function convertPositionalBinds(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `:${++index}`);
}

// Backwards-compatible query helper for routes that expect db.query(sql, params, cb)
async function query(sql, params, cb) {
  let connection;
  try {
    connection = await getConnection();
    // allow optional params
    const binds = params && !(typeof params === 'function') ? params : [];
    const callback = typeof params === 'function' ? params : cb;
    const hasArrayBinds = Array.isArray(binds);
    const statement = hasArrayBinds ? convertPositionalBinds(sql) : sql;
    const result = await connection.execute(statement, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });
    // If a callback is provided, call it (older routes expect callback style)
    if (typeof callback === 'function') {
      return callback(null, result.rows);
    }
    return result.rows;
  } catch (err) {
    if (typeof cb === 'function') return cb(err);
    throw err;
  } finally {
    if (connection) {
      try { await connection.close(); } catch (_) {}
    }
  }
}

module.exports = { getConnection, query };
