const { Pool } = require("pg");

var mainPool = null;
var poolCreated = false;

async function createPool() {
  const pool = new Pool({
    user: "postgres",
    host: process.env.DB_ADDRESS,
    database: "postgres",
    password: process.env.DB_PASS,
    port: "5432",
    connectionTimeoutMillis: 5000,
  });
  return pool;
}

async function dbQuery(queryString, parameters) {
  if (!poolCreated) {
    mainPool = await createPool();
    poolCreated = true;
  }

  return (res = await mainPool
    .query(queryString, parameters)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    }));
}

module.exports = dbQuery;
