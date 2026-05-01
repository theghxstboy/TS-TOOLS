export interface BugReport {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'resolved';
    userId: string;
    userEmail: string;
    createdAt: string;
}

export type CreateBugPayload = Omit<BugReport, 'id' | 'createdAt' | 'status'>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_ANON_KEY;

export async function addBug(bug: CreateBugPayload): Promise<BugReport> {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/bugs`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            title: bug.title,
            description: bug.description,
            severity: bug.severity,
            status: 'pending',
            userId: bug.userId,
            userEmail: bug.userEmail
        })
    });

    if (!res.ok) {
        const error = await res.text();
        console.error('Supabase insert failed:', error);
        throw new Error('Failed to insert bug report into Supabase');
    }

    const data = await res.json();
    return data[0];
}

export async function getBugs(): Promise<BugReport[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/bugs?select=*&order=createdAt.desc`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        if (!res.ok) throw new Error('Failed to fetch bugs');
        return await res.json();
    } catch (error) {
        console.error('Database GET bugs failed:', error);
        return [];
    }
}

export async function updateBugStatus(id: string, status: 'resolved' | 'in_progress' | 'pending'): Promise<BugReport | null> {
    if (!supabaseUrl || !supabaseKey) return null;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/bugs?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ status })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('Supabase PATCH failed:', res.status, errText);
            return null;
        }
        const data = await res.json();
        return data[0] || null;
    } catch (error) {
        console.error('Update bug status failed:', error);
        return null;
    }
}

export async function deleteBug(id: string): Promise<boolean> {
    if (!supabaseUrl || !supabaseKey) return false;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/bugs?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        return res.ok;
    } catch {
        return false;
    }
}
