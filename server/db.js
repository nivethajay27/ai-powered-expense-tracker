// server/db.js
import pg from "pg";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve('./.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;