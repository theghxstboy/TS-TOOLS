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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_ANON_KEY;

const getHeaders = () => {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
    }
    return {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };
};

export async function getPosts(): Promise<CodigosPost[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/codigos?select=*&order=date.desc`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        if (!res.ok) throw new Error('Failed to fetch codigos');
        const data = await res.json();
        
        return data.map((row: any) => ({
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
    const res = await fetch(`${supabaseUrl}/rest/v1/codigos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            title: post.title.toUpperCase(),
            author: post.author,
            language: post.language,
            code: post.code,
            tags: post.tags,
            imageUrl: post.imageUrl,
            isGif: post.isGif,
            observations: post.observations || "",
            userId: post.userId
        })
    });

    if (!res.ok) {
        const error = await res.text();
        console.error('Supabase insert failed:', error);
        throw new Error('Failed to insert post into Supabase');
    }

    const data = await res.json();
    return data[0];
}

export async function deletePost(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/codigos?id=eq.${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function updatePost(id: string, updates: Partial<CodigosPost>): Promise<CodigosPost | null> {
    if (Object.keys(updates).length === 0) return null;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/codigos?id=eq.${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });

        if (!res.ok) {
            console.error('Supabase update failed:', await res.text());
            return null;
        }

        const data = await res.json();
        return data[0] || null;
    } catch (error) {
        console.error('Update post failed:', error);
        return null;
    }
}
