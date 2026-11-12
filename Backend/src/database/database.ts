import 'dotenv/config';
import pg = require('pg');

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
}
/* 
  A pool is a system that reuses connections between frontend and backend 
*/
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Maximum number of clients in the pool
    max: 10,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => {
  console.error('Pool Error', error);
});

async function connectDatabase(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export = { pool, connectDatabase };