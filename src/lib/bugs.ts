import { query } from './db';

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

export async function addBug(bug: CreateBugPayload): Promise<BugReport> {
    const { rows } = await query(
        `INSERT INTO bugs (title, description, severity, status, "userId", "userEmail") 
         VALUES ($1, $2, $3, 'pending', $4, $5) 
         RETURNING *`,
        [bug.title, bug.description, bug.severity, bug.userId, bug.userEmail]
    );

    return rows[0];
}

export async function getBugs(): Promise<BugReport[]> {
    try {
        const { rows } = await query('SELECT * FROM bugs ORDER BY "createdAt" DESC');
        return rows || [];
    } catch (error) {
        console.error('Database GET bugs failed:', error);
        return [];
    }
}
