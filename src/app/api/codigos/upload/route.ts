import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Supabase not configured on server" }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `codigos/${fileName}`;

        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/codigos/${filePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
                'Content-Type': file.type,
            },
            body: await file.arrayBuffer(),
        });

        if (!uploadResponse.ok) {
            const err = await uploadResponse.json().catch(() => ({}));
            return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/codigos/${filePath}`;
        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
