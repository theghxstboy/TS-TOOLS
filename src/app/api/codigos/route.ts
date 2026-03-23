import { NextResponse } from "next/server";
import { getPosts, addPost } from "@/lib/codigos";
import { auth } from "@/auth";

export async function GET() {
    try {
        const posts = await getPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching codigos:", error);
        return NextResponse.json({ error: "Failed to fetch codigos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            console.error("API POST: Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, language, code, tags, imageUrl, isGif } = body;

        console.log(`API POST: Title=${title}, Author=${session.user.name}`);

        if (!title || !code) {
            return NextResponse.json({ error: "Title and code are required" }, { status: 400 });
        }

        const newPost = await addPost({
            title,
            language,
            code,
            tags,
            imageUrl,
            isGif,
            author: session.user.name || "Usuário",
            userId: session.user.id || "unknown"
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: any) {
        console.error("Error submitting codigo:", error);
        return NextResponse.json({ 
            error: "Failed to submit codigo", 
            details: error.message 
        }, { status: 500 });
    }
}
