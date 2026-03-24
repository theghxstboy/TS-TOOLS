const { Client } = require('pg');

const config = {
    host: 'aws-1-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.junfxbklqnhjidycaljl',
    password: 'kS75RFOAZNnEDOBD',
    ssl: { rejectUnauthorized: false }
};

async function setup() {
    const client = new Client(config);
    try {
        console.log("Connecting to new database...");
        await client.connect();
        
        console.log("Cleaning up old tables...");
        await client.query('DROP TABLE IF EXISTS tools CASCADE');
        await client.query('DROP TABLE IF EXISTS codigos CASCADE');

        console.log("Creating table 'codigos'...");
        await client.query(`
            create table if not exists codigos (
                id uuid primary key default gen_random_uuid(),
                title text not null,
                author text not null,
                date timestamptz not null default now(),
                language text not null,
                code text not null,
                "imageUrl" text,
                "isGif" boolean default false,
                tags text[] default array[]::text[],
                reactions jsonb default '{"fire": 0}'::jsonb,
                observations text,
                "userId" text
            );
        `);

        console.log("Creating table 'tools'...");
        await client.query(`
            create table if not exists tools (
                id uuid primary key default gen_random_uuid(),
                title text not null,
                description text not null,
                url text not null,
                category text not null,
                status text not null default 'pending',
                "submittedBy" text not null,
                "userId" text not null,
                "createdAt" timestamptz not null default now()
            );
        `);

        console.log("Database schema initialized successfully!");
    } catch (err) {
        console.error("Setup error:", err);
    } finally {
        await client.end();
    }
}

setup();
