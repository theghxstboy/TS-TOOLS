import { NextResponse } from "next/server";
import { getToolsByUser } from "@/lib/tools";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userTools = await getToolsByUser(session.user.email);
        return NextResponse.json(userTools);
    } catch (error) {
        console.error("Error fetching user tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}
