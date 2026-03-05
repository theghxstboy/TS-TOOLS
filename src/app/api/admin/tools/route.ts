import { NextResponse } from "next/server";
import { getTools, updateToolStatus } from "@/lib/tools";
import { auth } from "@/auth";

// Middleware/Helper to check if user is admin
async function isAdmin() {
    const session = await auth();
    return session?.user?.role === "admin" || session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const allTools = await getTools();
        // Return only pending tools for the admin to review
        const pendingTools = allTools.filter(tool => tool.status === "pending");
        return NextResponse.json(pendingTools);
    } catch (error) {
        console.error("Error fetching pending tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status || !["approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const updatedTool = await updateToolStatus(id, status as "approved" | "rejected");

        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTool);
    } catch (error) {
        console.error("Error updating tool status:", error);
        return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
    }
}
