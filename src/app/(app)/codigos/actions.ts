'use server';

import { addPost, updatePost, deletePost, CodigosPost } from "@/lib/codigos";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Server Action for saving/updating snippets.
 * Using FormData to handle large files (up to 100MB) without Base64 overhead in JSON.
 */
export async function saveCodigoAction(formData: FormData, editingId?: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const language = formData.get("language") as string;
    const code = formData.get("code") as string;
    const tags = JSON.parse(formData.get("tags") as string || "[]");
    const isGif = formData.get("isGif") === "true";
    
    const imageUrl = formData.get("imageUrl") as string | null;

    const postData = {
        title: title.toUpperCase(),
        language,
        code,
        tags,
        imageUrl,
        isGif,
        observations: formData.get("observations") as string || ""
    };

    if (editingId) {
        const updated = await updatePost(editingId, postData);
        if (!updated) throw new Error("Failed to update snippet");
        revalidatePath("/codigos");
        return updated;
    } else {
        const newPost = await addPost({
            ...postData,
            author: session.user.name || "Usuário",
            userId: session.user.id || "unknown"
        });
        revalidatePath("/codigos");
        return newPost;
    }
}

export async function deleteCodigoAction(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    
    const success = await deletePost(id);
    if (!success) throw new Error("Failed to delete snippet");
    revalidatePath("/codigos");
    return { success: true };
}

export async function toggleLikeAction(id: string, count: number) {
    const updated = await updatePost(id, { reactions: { fire: count } });
    if (!updated) throw new Error("Failed to update reaction");
    return updated;
}
