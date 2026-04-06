import { NextResponse } from "next/server";
import { US_STATES_DATA } from "@/data/us-states-data";

export const dynamic = 'force-dynamic';
const NEWS_API_KEY = "310884ce081549358c6348693784848b";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ stateId: string }> }
) {
    try {
        const { stateId } = await params;
        const id = stateId.toUpperCase();
        const state = US_STATES_DATA[id];

        if (!state) {
            return NextResponse.json({ error: "State not found" }, { status: 404 });
        }

        // 3. Fetch from NewsAPI using qInTitle for strict precision
        // We use qInTitle for the state to ensure it's the MAIN subject.
        const industryQuery = `"home services" OR remodeling OR roofing OR "residential repair" OR "real estate brokerage" OR "realtor"`;
        const newsUrl = `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(state.name)}&q=${encodeURIComponent(industryQuery)}&language=en,es,pt&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`;

        console.log(`🌐 FETCHING (With 24h Cache): ${state.name} news (ID: ${id})...`);
        
        const response = await fetch(newsUrl, {
            next: { revalidate: 86400 }
        });

        const data = await response.json();

        if (data.status !== "ok") {
            if (data.code === "rateLimited") {
                console.error("❌ NewsAPI Limit Reached (100 req/day).");
            }
            return NextResponse.json({ error: "Failed to fetch news", code: data.code }, { status: data.code === "rateLimited" ? 429 : 500 });
        }

        // Map and Translate Titles (Best effort using MyMemory API - Free)
        const articles = await Promise.all(data.articles.map(async (a: any) => {
            let translatedTitle = a.title;
            try {
                const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(a.title)}&langpair=en|pt-BR`);
                const transData = await transRes.json();
                if (transData.responseData?.translatedText) {
                    translatedTitle = transData.responseData.translatedText;
                }
            } catch (e) {
                console.error("Translation failed");
            }

            return {
                title: translatedTitle,
                originalTitle: a.title,
                description: a.description,
                url: a.url,
                urlToImage: a.urlToImage,
                publishedAt: a.publishedAt,
                source: a.source.name
            };
        }));

        return new NextResponse(JSON.stringify({ 
            source: "news-api-live",
            news: articles 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            }
        });

    } catch (error: any) {
        console.error("State News API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
