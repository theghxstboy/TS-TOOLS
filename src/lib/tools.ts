import fs from 'fs/promises';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'tools.json');

// Ensure the data directory and file exist
async function initDb() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // File doesn't exist, create it with an empty array
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
}

export async function getTools(): Promise<Tool[]> {
    await initDb();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tools database:', error);
        return [];
    }
}

export async function saveTools(tools: Tool[]): Promise<void> {
    await initDb();
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(tools, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to tools database:', error);
        throw new Error('Failed to save data');
    }
}

export async function addTool(tool: Omit<Tool, 'id' | 'createdAt' | 'status'>): Promise<Tool> {
    const tools = await getTools();

    const newTool: Tool = {
        ...tool,
        id: crypto.randomUUID(),
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    tools.push(newTool);
    await saveTools(tools);

    return newTool;
}

export async function updateToolStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<Tool | null> {
    const tools = await getTools();
    const index = tools.findIndex(t => t.id === id);

    if (index === -1) return null;

    tools[index] = {
        ...tools[index],
        status,
    };

    await saveTools(tools);
    return tools[index];
}

export async function getToolsByUser(userId: string): Promise<Tool[]> {
    const tools = await getTools();
    return tools.filter(t => t.userId === userId);
}

export async function deleteTool(id: string): Promise<boolean> {
    let tools = await getTools();
    const initialLength = tools.length;
    tools = tools.filter(t => t.id !== id);

    if (tools.length === initialLength) return false;

    await saveTools(tools);
    return true;
}

export async function updateTool(id: string, updates: Partial<Tool>): Promise<Tool | null> {
    const tools = await getTools();
    const index = tools.findIndex(t => t.id === id);

    if (index === -1) return null;

    tools[index] = {
        ...tools[index],
        ...updates,
    };

    await saveTools(tools);
    return tools[index];
}
