const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'aws-1-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.junfxbklqnhjidycaljl',
    password: 'kS75RFOAZNnEDOBD',
    ssl: { rejectUnauthorized: false }
};

const basicUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function migrateTools(client) {
    console.log("Migrating tools...");
    const filePath = path.join(__dirname, '..', 'data', 'tools.json');
    if (!fs.existsSync(filePath)) {
        console.log("tools.json not found, skipping.");
        return;
    }
    
    const tools = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Found ${tools.length} tools to migrate.`);

    for (const tool of tools) {
        process.stdout.write(`Migrating tool: ${tool.title}... `);
        
        if (!basicUuidRegex.test(tool.id)) {
            tool.id = require('crypto').randomUUID();
        }

        try {
            await client.query(
                `INSERT INTO tools (id, title, description, url, category, status, "submittedBy", "userId", "createdAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                 ON CONFLICT (id) DO NOTHING`,
                [tool.id, tool.title, tool.description, tool.url, tool.category, tool.status, tool.submittedBy, tool.userId, tool.createdAt]
            );
            console.log("OK");
        } catch (err) {
            console.log("FAILED:", err.message);
        }
    }
}

async function migrateCodigos(client) {
    console.log("\nMigrating codigos...");
    const filePath = path.join(__dirname, '..', 'data', 'codigos.json');
    if (!fs.existsSync(filePath)) {
        console.log("codigos.json not found, skipping.");
        return;
    }
    
    const codigos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Found ${codigos.length} codigos to migrate.`);

    for (const item of codigos) {
        process.stdout.write(`Migrating codigo: ${item.title}... `);
        
        if (!basicUuidRegex.test(item.id)) {
            item.id = require('crypto').randomUUID();
        }

        try {
            await client.query(
                `INSERT INTO codigos (id, title, author, date, language, code, "imageUrl", "isGif", tags, reactions, observations, "userId") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                 ON CONFLICT (id) DO NOTHING`,
                [
                    item.id, item.title, item.author, item.date, item.language, item.code, 
                    item.imageUrl, item.isGif, item.tags, item.reactions, item.observations || "", item.userId
                ]
            );
            console.log("OK");
        } catch (err) {
            console.log("FAILED:", err.message);
        }
    }
}

async function run() {
    const client = new Client(config);
    try {
        await client.connect();
        
        console.log("Inspecting 'codigos' schema...");
        const schema = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'codigos'
        `);
        console.log(JSON.stringify(schema.rows, null, 2));

        await migrateTools(client);
        await migrateCodigos(client);
        console.log("\nMigration completed!");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await client.end();
    }
}

run();

export {};
