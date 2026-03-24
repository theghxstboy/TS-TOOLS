export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://izxutidvmffhmetjpoao.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_TbDj_MKk1jWEn02UWIho0g_kyCnjZcB";

/**
 * Utility to communicate with Supabase via REST for both Table and Storage.
 * Using pure fetch to avoid external dependencies.
 */
export async function supabaseFetch(path_str: string, options: RequestInit = {}) {
    const res = await fetch(`${SUPABASE_URL}${path_str}`, {
        ...options,
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
            ...options.headers,
        },
    });
    
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Supabase error:", err);
        throw new Error(err.message || res.statusText);
    }
    
    // Some responses might be empty for certain operations
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}
