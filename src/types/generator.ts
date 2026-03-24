export interface HistoryItem<T = unknown> {
    id: string;
    generatorId: string;
    timestamp: number;
    payload: T;
    prompt: string;
}

export interface FavoriteItem<T = unknown> extends HistoryItem<T> {
    title: string;
}

export type GeneratorId = 'gerador' | 'gerador-humano' | 'gerador-video' | 'gerador-webdesign' | 'antes-depois' | 'checklist-webdesign';

export interface CommandAction {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href?: string;
    onSelect?: (action: CommandAction) => void;
    category: string;
    badge?: string;
    payload?: unknown;
}
