import fs from 'fs/promises';
import path from 'path';
import { query } from './db';

export interface CodigosPost {
    id: string;
    title: string;
    author: string;
    date: string;
    language: string;
    code: string;
    imageUrl: string | null;
    isGif: boolean;
    tags: string[];
    reactions: { fire: number };
    observations?: string;
    userId?: string;
}

async function saveImageLocally(base64Data: string, id: string, isGif: boolean): Promise<string | null> {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;
    
    try {
        const base64Content = base64Data.split(';base64,').pop();
        if (!base64Content) return null;
        
        const extension = isGif ? 'gif' : 'png';
        const fileName = `${id}.${extension}`;
        const relativePath = `/uploads/codigos/${fileName}`;
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'codigos', fileName);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        
        const fileContent = Buffer.from(base64Content, 'base64');
        await fs.writeFile(fullPath, fileContent);
        
        return `${relativePath}?v=${Date.now()}`;
    } catch (e) {
        console.error("Error saving image locally:", e);
        return null;
    }
}

export async function getPosts(): Promise<CodigosPost[]> {
    try {
        const { rows } = await query('SELECT * FROM codigos ORDER BY date DESC');
        return rows.map(row => ({
            ...row,
            imageUrl: row.imageUrl,
            isGif: row.isGif,
            userId: row.userId
        }));
    } catch (error) {
        console.error('Database GET failed:', error);
        return [];
    }
}

export async function addPost(post: Omit<CodigosPost, 'id' | 'date' | 'reactions'>): Promise<CodigosPost> {
    const tempId = crypto.randomUUID();
    
    // Handle image upload to local storage
    let imageUrl = post.imageUrl;
    if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await saveImageLocally(imageUrl, tempId, post.isGif);
    }

    const { rows } = await query(
        `INSERT INTO codigos (title, author, language, code, tags, "imageUrl", "isGif", observations, "userId") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
            post.title.toUpperCase(), 
            post.author, 
            post.language, 
            post.code, 
            post.tags, 
            imageUrl, 
            post.isGif, 
            post.observations || "", 
            post.userId
        ]
    );

    return rows[0];
}

export async function deletePost(id: string): Promise<boolean> {
    try {
        await query('DELETE FROM codigos WHERE id = $1', [id]);
        return true;
    } catch {
        return false;
    }
}

export async function updatePost(id: string, updates: Partial<CodigosPost>): Promise<CodigosPost | null> {
    // If updating image, handle upload first
    if (updates.imageUrl && updates.imageUrl.startsWith('data:')) {
        updates.imageUrl = await saveImageLocally(updates.imageUrl, id, updates.isGif || false);
    }

    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    // Map camelCase keys to quoted identifiers if they match the DB column names
    const setClause = fields.map((f, i) => {
        const columnName = (f === "imageUrl" || f === "isGif" || f === "userId") ? `"${f}"` : f;
        return `${columnName} = $${i + 1}`;
    }).join(', ');
    const values = fields.map(f => (updates as any)[f]);

    const { rows } = await query(
        `UPDATE codigos SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
    );
    
    return rows[0] || null;
}
