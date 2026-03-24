import { query } from './db';

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

export async function getTools(): Promise<Tool[]> {
    try {
        const { rows } = await query('SELECT * FROM tools ORDER BY "createdAt" DESC');
        return rows.map(row => ({
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
    const { rows } = await query(
        `INSERT INTO tools (title, description, url, category, status, "submittedBy", "userId") 
         VALUES ($1, $2, $3, $4, 'pending', $5, $6) 
         RETURNING *`,
        [tool.title, tool.description, tool.url, tool.category, tool.submittedBy, tool.userId]
    );

    return rows[0];
}

export async function updateToolStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<Tool | null> {
    const { rows } = await query(
        'UPDATE tools SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return rows[0] || null;
}

export async function getToolsByUser(userId: string): Promise<Tool[]> {
    try {
        const { rows } = await query('SELECT * FROM tools WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
        return rows || [];
    } catch (error) {
        console.error('Database GET tools by user failed:', error);
        return [];
    }
}

export async function deleteTool(id: string): Promise<boolean> {
    try {
        await query('DELETE FROM tools WHERE id = $1', [id]);
        return true;
    } catch {
        return false;
    }
}

export async function updateTool(id: string, updates: Partial<Tool>): Promise<Tool | null> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    const setClause = fields.map((f, i) => {
        const columnName = (f === "submittedBy" || f === "userId" || f === "createdAt") ? `"${f}"` : f;
        return `${columnName} = $${i + 1}`;
    }).join(', ');
    const values = fields.map(f => (updates as any)[f]);

    const { rows } = await query(
        `UPDATE tools SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
    );
    
    return rows[0] || null;
}
