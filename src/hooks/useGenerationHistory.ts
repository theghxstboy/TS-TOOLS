"use client"

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { HistoryItem, GeneratorId } from '@/types/generator';

const MAX_HISTORY_ITEMS = 50;

export function useGenerationHistory<T>(generatorId: string) {
  const key = `ts-tools-history-${generatorId}`;
  const {
    value: history,
    setValue: setHistory,
    remove: clearHistory
  } = useLocalStorage<HistoryItem<T>[]>(key, []);

  // Save history item
  const saveHistory = useCallback((payload: T, prompt: string) => {
    const newItem: HistoryItem<T> = {
      id: crypto.randomUUID(),
      generatorId,
      timestamp: Date.now(),
      payload,
      prompt,
    };

    setHistory((prevHistory) => {
      const updatedHistory = [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      return updatedHistory;
    });
  }, [generatorId, setHistory]);

  return {
    history,
    saveHistory,
    clearHistory,
  };
}
