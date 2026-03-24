import { Pool } from 'pg';

// Direct Postgres connection (Bypasses PostgREST and RLS)
const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}
