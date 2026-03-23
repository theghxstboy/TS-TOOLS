import fs from 'fs/promises';
import path from 'path';

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

const SUPABASE_URL = "https://izxutidvmffhmetjpoao.supabase.co";
const SUPABASE_KEY = "sb_publishable_TbDj_MKk1jWEn02UWIho0g_kyCnjZcB";

/**
 * Utility to communicate with Supabase via REST for both Table and Storage.
 * Using pure fetch to avoid external dependencies.
 */

async function supabaseFetch(path_str: string, options: RequestInit = {}) {
    const res = await fetch(`${SUPABASE_URL}${path_str}`, {
        ...options,
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
            ...options.headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("Supabase error:", err);
        throw new Error(err.message || res.statusText);
    }
    return res.json();
}

async function uploadToSupabase(base64Data: string, id: string, isGif: boolean): Promise<string | null> {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;
    
    try {
        const base64Content = base64Data.split(';base64,').pop();
        if (!base64Content) return null;
        
        const extension = isGif ? 'gif' : 'png';
        const fileName = `${id}.${extension}`;
        const contentType = isGif ? 'image/gif' : 'image/png';
        const fileContent = Buffer.from(base64Content, 'base64');
        
        // Use Storage API directly with fetch
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/codigos/${fileName}`, {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": contentType,
            },
            body: fileContent
        });

        // 409 means already exists (updating)
        if (res.status === 409) {
             await fetch(`${SUPABASE_URL}/storage/v1/object/codigos/${fileName}`, {
                method: 'PUT',
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": contentType,
                },
                body: fileContent
            });
        } else if (!res.ok) {
            throw new Error(`Storage failure: ${res.statusText}`);
        }
        
        // Public link: URL/storage/v1/object/public/BUCKET/NAME
        return `${SUPABASE_URL}/storage/v1/object/public/codigos/${fileName}?v=${Date.now()}`;
    } catch (e) {
        console.error("Error uploading to Supabase Storage:", e);
        return null;
    }
}

export async function getPosts(): Promise<CodigosPost[]> {
    try {
        const data = await supabaseFetch("/rest/v1/codigos?select=*&order=date.desc");
        return data;
    } catch (error) {
        console.error('Supabase GET failed:', error);
        return [];
    }
}

export async function addPost(post: Omit<CodigosPost, 'id' | 'date' | 'reactions'>): Promise<CodigosPost> {
    const tempId = crypto.randomUUID();
    
    // Handle image upload to storage bucket
    let imageUrl = post.imageUrl;
    if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await uploadToSupabase(imageUrl, tempId, post.isGif);
    }

    const data = await supabaseFetch("/rest/v1/codigos", {
        method: "POST",
        body: JSON.stringify({
            ...post,
            imageUrl,
            date: new Date().toISOString(),
            reactions: { fire: 0 }
        })
    });

    return data[0];
}

export async function deletePost(id: string): Promise<boolean> {
    try {
        await supabaseFetch(`/rest/v1/codigos?id=eq.${id}`, { method: "DELETE" });
        return true;
    } catch {
        return false;
    }
}

export async function updatePost(id: string, updates: Partial<CodigosPost>): Promise<CodigosPost | null> {
    // If updating image, handle upload first
    if (updates.imageUrl && updates.imageUrl.startsWith('data:')) {
        updates.imageUrl = await uploadToSupabase(updates.imageUrl, id, updates.isGif || false);
    }

    const data = await supabaseFetch(`/rest/v1/codigos?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
    });
    return data[0] || null;
}
