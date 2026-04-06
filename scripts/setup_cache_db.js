const { Pool } = require('pg');
// Removed dotenv require, use node --env-file=.env.local

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

async function setup() {
  try {
    console.log("Connecting to Supabase...");
    const client = await pool.connect();
    console.log("Creating table state_content_cache...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS state_content_cache (
        state_id TEXT PRIMARY KEY,
        news_json JSONB,
        events_json JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    client.release();
    console.log("✅ Table state_content_cache created/verified successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating table:", err);
    process.exit(1);
  }
}

setup();
