import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateBugStatus, deleteBug } from "@/lib/bugs";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await props.params;
        const body = await request.json();
        const { status } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updated = await updateBugStatus(id, status);
        if (!updated) {
            // Se retornar null, pode ser erro no fetch ou RLS
            return NextResponse.json({ error: "Falha ao atualizar bug no banco" }, { status: 500 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating bug:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await props.params;
        const success = await deleteBug(id);
        if (!success) {
            return NextResponse.json({ error: "Failed to delete bug" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bug:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
