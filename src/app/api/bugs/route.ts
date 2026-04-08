import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addBug } from "@/lib/bugs";
import { z } from "zod";

const bugSchema = z.object({
    title: z.string().min(5, "O título precisa ter pelo menos 5 caracteres").max(100, "O título é muito longo"),
    description: z.string().min(10, "Detalhe melhor o bug (mínimo de 10 caracteres)").max(3000, "Descrição excede o limite"),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
});

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Você precisa estar logado para reportar." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = bugSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const newBug = await addBug({
            title: parsed.data.title,
            description: parsed.data.description,
            severity: parsed.data.severity,
            userId: session.user.id || 'unknown_id',
            userEmail: session.user.email || 'unknown_email',
        });

        return NextResponse.json({ success: true, bug: newBug }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating bug report:", error);
        return NextResponse.json({ error: "Erro interno do servidor ao criar report." }, { status: 500 });
    }
}
