import { NextResponse } from "next/server";
import { getTools, updateToolStatus } from "@/lib/tools";
import { auth } from "@/auth";
import { updateToolStatusSchema } from "@/lib/validations";

// Helper: verifica se a sessão atual tem papel de admin
async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized", status: 401 } as const;
    if (session.user.role !== "admin") return { error: "Forbidden", status: 403 } as const;
    return null;
}

export async function GET() {
    try {
        const authError = await requireAdmin();
        if (authError) {
            return NextResponse.json({ error: authError.error }, { status: authError.status });
        }

        const allTools = await getTools();
        const pendingTools = allTools.filter(tool => tool.status === "pending");
        return NextResponse.json(pendingTools);
    } catch (error) {
        console.error("Error fetching pending tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const authError = await requireAdmin();
        if (authError) {
            return NextResponse.json({ error: authError.error }, { status: authError.status });
        }

        const body = await request.json();

        // Valida com Zod — consistente com as demais rotas da API
        const idParsed = typeof body?.id === "string" && body.id.length > 0;
        if (!idParsed) {
            return NextResponse.json({ error: "ID da ferramenta é obrigatório" }, { status: 400 });
        }

        const statusParsed = updateToolStatusSchema.safeParse({ status: body.status });
        if (!statusParsed.success) {
            return NextResponse.json(
                { error: statusParsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const updatedTool = await updateToolStatus(body.id, statusParsed.data.status);

        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTool);
    } catch (error) {
        console.error("Error updating tool status:", error);
        return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
    }
}
