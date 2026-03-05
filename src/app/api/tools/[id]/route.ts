import { NextResponse } from "next/server";
import { updateToolStatus, deleteTool, updateTool } from "@/lib/tools";
import { auth } from "@/auth";
import { updateToolSchema, updateToolStatusSchema } from "@/lib/validations";

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const parsed = updateToolStatusSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { status } = parsed.data;

        const updatedTool = await updateToolStatus(params.id, status);
        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTool);
    } catch (error) {
        console.error("Error updating tool status:", error);
        return NextResponse.json({ error: "Failed to update tool status" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const parsed = updateToolSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const updatedTool = await updateTool(params.id, parsed.data);

        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTool);
    } catch (error) {
        console.error("Error updating tool:", error);
        return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth();

        // Let's assume only admins can delete
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deleted = await deleteTool(params.id);
        if (!deleted) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting tool:", error);
        return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
    }
}
