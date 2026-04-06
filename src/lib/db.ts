import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
    if (!pool) {
        const user = process.env.SUPABASE_DB_USER;
        const host = process.env.SUPABASE_DB_HOST;
        const password = process.env.SUPABASE_DB_PASSWORD;
        const database = process.env.SUPABASE_DB_NAME || 'postgres';
        const port = parseInt(process.env.SUPABASE_DB_PORT || '6543');

        // Log configuration attempt (safety: no password)
        if (!user || !host || !password) {
            console.error("❌ Database config missing!", {
                user: !!user,
                host: !!host,
                password: !!password,
                db: database,
                port
            });
            throw new Error("Missing database environment variables");
        }

        pool = new Pool({
            host,
            port,
            database,
            user,
            password,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 10000,
        });
        
        console.log(`🔌 Database pool initialized for user: ${user}`);
    }
    return pool;
}

export async function query(text: string, params?: any[]) {
    try {
        const start = Date.now();
        const activePool = getPool();
        const res = await activePool.query(text, params);
        const duration = Date.now() - start;
        // console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error: any) {
        console.error("❌ Database Query Error:", error.message);
        throw error;
    }
}
