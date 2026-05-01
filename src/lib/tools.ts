export interface Tool {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedBy: string;
    userId: string;
    createdAt: string;
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

export async function getTools(): Promise<Tool[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/tools?select=*&order=createdAt.desc`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        if (!res.ok) throw new Error('Failed to fetch tools');
        const data = await res.json();

        return data.map((row: any) => ({
            ...row,
            submittedBy: row.submittedBy,
            userId: row.userId,
            createdAt: row.createdAt
        }));
    } catch (error) {
        console.error('Database GET tools failed:', error);
        return [];
    }
}

export async function addTool(tool: Omit<Tool, 'id' | 'createdAt' | 'status'>): Promise<Tool> {
    const res = await fetch(`${supabaseUrl}/rest/v1/tools`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            title: tool.title,
            description: tool.description,
            url: tool.url,
            category: tool.category,
            status: 'pending',
            submittedBy: tool.submittedBy,
            userId: tool.userId
        })
    });

    if (!res.ok) {
        const error = await res.text();
        console.error('Supabase insert tool failed:', error);
        throw new Error('Failed to insert tool into Supabase');
    }

    const data = await res.json();
    return data[0];
}

export async function updateToolStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<Tool | null> {
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/tools?id=eq.${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });

        if (!res.ok) return null;
        const data = await res.json();
        return data[0] || null;
    } catch (error) {
        console.error('Update tool status failed:', error);
        return null;
    }
}

export async function getToolsByUser(userId: string): Promise<Tool[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/tools?userId=eq.${userId}&select=*&order=createdAt.desc`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        if (!res.ok) throw new Error('Failed to fetch tools by user');
        return await res.json();
    } catch (error) {
        console.error('Database GET tools by user failed:', error);
        return [];
    }
}

export async function deleteTool(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/tools?id=eq.${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function updateTool(id: string, updates: Partial<Tool>): Promise<Tool | null> {
    if (Object.keys(updates).length === 0) return null;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/tools?id=eq.${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });

        if (!res.ok) {
            console.error('Supabase update tool failed:', await res.text());
            return null;
        }

        const data = await res.json();
        return data[0] || null;
    } catch (error) {
        console.error('Update tool failed:', error);
        return null;
    }
}
