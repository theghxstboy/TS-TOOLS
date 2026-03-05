import { z } from "zod";

export const toolSchema = z.object({
    title: z.string().min(1, "O nome da ferramenta é obrigatório").max(100, "Nome muito longo"),
    description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres").max(500, "Descrição muito longa"),
    url: z.string().url("A URL da ferramenta precisa ser válida"),
    category: z.string().min(1, "A categoria é obrigatória").max(50, "Categoria muito longa")
});

export const updateToolSchema = toolSchema.partial();

export const updateToolStatusSchema = z.object({
    status: z.enum(["approved", "rejected", "pending"])
});
