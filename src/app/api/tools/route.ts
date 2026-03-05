import { NextResponse } from "next/server";
import { getTools, addTool } from "@/lib/tools";
import { auth } from "@/auth";
import { toolSchema } from "@/lib/validations";

export async function GET() {
    try {
        const session = await auth();
        const allTools = await getTools();

        // Admins can see everything, normal users only approved
        if (session?.user?.role === "admin") {
            return NextResponse.json(allTools);
        }

        const approvedTools = allTools.filter(tool => tool.status === "approved");
        return NextResponse.json(approvedTools);
    } catch (error) {
        console.error("Error fetching tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Only authenticated users can submit a tool
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Zod validation
        const parsed = toolSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { title, description, url, category } = parsed.data;

        const newTool = await addTool({
            title,
            description,
            url,
            category,
            submittedBy: session.user.name || session.user.email || "Usuário",
            userId: session.user.email || session.user.id || "unknown", // Using email as the primary tracker
        });

        return NextResponse.json(newTool, { status: 201 });
    } catch (error) {
        console.error("Error submitting tool:", error);
        return NextResponse.json({ error: "Failed to submit tool" }, { status: 500 });
    }
}
