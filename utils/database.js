import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const db = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});
db.connect((err) => {
  if (err) {
    console.error(`db error\n${err.message}`);
    throw 'db error';
  } else {
    console.log(`connected to database`);
  }
});

export default db;
