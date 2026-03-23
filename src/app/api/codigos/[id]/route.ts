import { NextResponse } from "next/server";
import { getPosts, deletePost, updatePost } from "@/lib/codigos";
import { auth } from "@/auth";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = session.user.role === "admin";
        const allPosts = await getPosts();
        const post = allPosts.find((p) => p.id === params.id);

        if (!post) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }

        if (!isAdmin && post.author !== (session.user.name || "Usuário")) {
            return NextResponse.json({ error: "Unauthorized deletion" }, { status: 403 });
        }

        const success = await deletePost(params.id);
        if (!success) {
            return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
        }

        return NextResponse.json({ message: "Snippet deleted successfully" });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = session.user.role === "admin";
        const allPosts = await getPosts();
        const post = allPosts.find((p) => p.id === params.id);

        if (!post) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }

        if (!isAdmin && post.author !== (session.user.name || "Usuário")) {
            return NextResponse.json({ error: "Unauthorized update" }, { status: 403 });
        }

        const body = await request.json();
        const updated = await updatePost(params.id, body);

        if (!updated) {
            return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating snippet:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
