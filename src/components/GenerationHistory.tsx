import { HistoryItem } from "@/types/generator";
import { History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GenerationHistoryProps<T> {
    history: HistoryItem<T>[];
    onRestore: (item: HistoryItem<T>) => void;
    generatorName: string;
}

export function GenerationHistory<T>({ history, onRestore, generatorName }: GenerationHistoryProps<T>) {
    // Show only the 4 most recent items
    const recentHistory = (history || []).slice(0, 4);
    const hasHistory = recentHistory.length > 0;

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 mt-6 w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <History size={24} className="text-primary" />
                    Histórico Recente
                </h2>
                {hasHistory && (
                    <Link
                        href={`/historico?gerador=${generatorName}`}
                        className="text-sm font-semibold text-primary hover:text-orange-400 flex items-center gap-1 transition-colors"
                    >
                        Ver Completo <ArrowRight size={16} />
                    </Link>
                )}
            </div>

            {hasHistory ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {recentHistory.map((item) => {
                        const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR });

                        return (
                            <button
                                key={item.id}
                                onClick={() => onRestore(item)}
                                className="bg-input/30 hover:bg-input border border-border hover:border-primary/50 text-left p-4 rounded-xl transition-all group flex flex-col h-[130px] w-full"
                                title="Clique para restaurar estas configurações"
                                type="button"
                            >
                                <div className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1 uppercase tracking-wider font-bold">
                                    <History size={12} />
                                    {timeAgo}
                                </div>
                                <p className="text-sm text-foreground font-medium line-clamp-3 mb-auto group-hover:text-primary transition-colors leading-tight">
                                    {item.prompt || "Prompt sem texto"}
                                </p>
                                <div className="mt-2 text-[10px] font-bold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    Lembrar <ArrowRight size={12} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl opacity-40">
                    <History size={32} className="mb-2" />
                    <p className="text-xs font-semibold uppercase tracking-widest">Nenhuma geração ainda</p>
                </div>
            )}

            <p className="text-[10px] text-muted-foreground mt-4 text-center uppercase tracking-widest font-bold opacity-50">
                O sistema guarda até 50 gerações recentes no navegador.
            </p>
        </div>
    );
}
