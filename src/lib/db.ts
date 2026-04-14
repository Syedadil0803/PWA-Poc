import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: readonly unknown[]) {
  return pool.query(text, params ? [...params] : []);
}
