import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

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
    userId?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'codigos.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'codigos');

// Ensure the data directory and file exist
async function initDb() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // File doesn't exist, create it with an empty array
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
    
    // Ensure uploads directory exists
    try {
        await fs.access(UPLOADS_DIR);
    } catch {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }
}

async function saveImage(base64Data: string, id: string, isGif: boolean): Promise<string | null> {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;
    
    try {
        const base64Content = base64Data.split(';base64,').pop();
        if (!base64Content) return null;
        
        const extension = isGif ? 'gif' : 'png';
        const fileName = `${id}.${extension}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        
        await fs.writeFile(filePath, Buffer.from(base64Content, 'base64'));
        return `/codigos/${fileName}?v=${Date.now()}`;
    } catch (e) {
        console.error("Error saving image:", e);
        return null;
    }
}

export async function getPosts(): Promise<CodigosPost[]> {
    await initDb();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading codigos database:', error);
        return [];
    }
}

export async function savePosts(posts: CodigosPost[]): Promise<void> {
    await initDb();
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to codigos database:', error);
        throw new Error('Failed to save data');
    }
}

export async function addPost(post: Omit<CodigosPost, 'id' | 'date' | 'reactions'>): Promise<CodigosPost> {
    const posts = await getPosts();

    const newId = typeof randomUUID === 'function' 
        ? randomUUID() 
        : `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Save image to file system instead of keeping Base64 in JSON
    const imageUrl = post.imageUrl ? await saveImage(post.imageUrl, newId, post.isGif) : null;

    const newPost: CodigosPost = {
        ...post,
        imageUrl,
        id: newId,
        date: new Date().toISOString(),
        reactions: { fire: 0 }
    };

    posts.push(newPost);
    await savePosts(posts);

    return newPost;
}

export async function deletePost(id: string): Promise<boolean> {
    let posts = await getPosts();
    const initialLength = posts.length;
    
    const postToDelete = posts.find(p => p.id === id);
    if (postToDelete?.imageUrl?.startsWith('/codigos/')) {
        try {
            const fileName = postToDelete.imageUrl.split('?')[0].split('/').pop();
            if (fileName) await fs.unlink(path.join(UPLOADS_DIR, fileName));
        } catch (e) {}
    }

    posts = posts.filter(p => p.id !== id);

    if (posts.length === initialLength) return false;

    await savePosts(posts);
    return true;
}

export async function updatePost(id: string, updates: Partial<CodigosPost>): Promise<CodigosPost | null> {
    const posts = await getPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) return null;

    // If updating image, save new file
    if (updates.imageUrl && updates.imageUrl.startsWith('data:')) {
        updates.imageUrl = await saveImage(updates.imageUrl, id, updates.isGif || posts[index].isGif);
    }

    posts[index] = {
        ...posts[index],
        ...updates,
    };

    await savePosts(posts);
    return posts[index];
}
