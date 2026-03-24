import { Pool } from 'pg';

// Direct Postgres connection (Bypasses PostgREST and RLS)
const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST || 'db.junfxbklqnhjidycaljl.supabase.co',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD || 'kS75RFOAZNnEDOBD',
    ssl: {
        rejectUnauthorized: false // Required for Supabase in many environments
    }
});

export async function query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}
