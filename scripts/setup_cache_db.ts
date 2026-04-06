import { query } from './src/lib/db';

async function setup() {
  try {
    console.log("Creating table state_content_cache...");
    await query(`
      CREATE TABLE IF NOT EXISTS state_content_cache (
        state_id TEXT PRIMARY KEY,
        news_json JSONB,
        events_json JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Table state_content_cache created/verified successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating table:", err);
    process.exit(1);
  }
}

setup();
