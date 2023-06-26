const { DB } = require('./config');
const   Pool = require('pg').Pool;
const   pool = new Pool({
  user    : DB.user,
  host    : DB.host,
  database: DB.database,
  password: DB.password,
  port    : DB.dbport,
});

module.exports = { pool };