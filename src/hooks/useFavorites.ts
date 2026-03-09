"use client"

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { FavoriteItem, GeneratorId } from '@/types/generator';

const FAVORITES_KEY = 'ts-tools-favorites';

export function useFavorites() {
    const {
        value: favorites,
        setValue: setFavorites,
        isLoaded
    } = useLocalStorage<FavoriteItem[]>(FAVORITES_KEY, []);

    // Check if an item is favorited (by prompt content or ID)
    const isFavorited = useCallback((prompt: string) => {
        return favorites.some(item => item.prompt === prompt);
    }, [favorites]);

    // Add to favorites
    const addFavorite = useCallback((generatorId: GeneratorId, payload: unknown, prompt: string, title?: string) => {
        const newItem: FavoriteItem = {
            id: crypto.randomUUID(),
            generatorId,
            timestamp: Date.now(),
            payload,
            prompt,
            title: title || `Favorito ${new Date().toLocaleDateString('pt-BR')}`
        };

        setFavorites((prev) => {
            // Avoid duplicates by prompt content
            if (prev.some(item => item.prompt === prompt)) return prev;
            return [newItem, ...prev];
        });
    }, [setFavorites]);

    // Remove from favorites
    const removeFavorite = useCallback((prompt: string) => {
        setFavorites((prev) => prev.filter(item => item.prompt !== prompt));
    }, [setFavorites]);

    // Toggle favorite
    const toggleFavorite = useCallback((generatorId: GeneratorId, payload: unknown, prompt: string, title?: string) => {
        if (isFavorited(prompt)) {
            removeFavorite(prompt);
        } else {
            addFavorite(generatorId, payload, prompt, title);
        }
    }, [isFavorited, removeFavorite, addFavorite]);

    return {
        favorites,
        isFavorited,
        toggleFavorite,
        removeFavorite,
        addFavorite,
        isLoaded
    };
}
