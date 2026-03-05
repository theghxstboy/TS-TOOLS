import { useState, useEffect } from 'react';

export interface HistoryItem<T = any> {
  id: string;
  generatorId: string;
  timestamp: number;
  payload: T;
  prompt: string;
}

const MAX_HISTORY_ITEMS = 50;

export function useGenerationHistory<T>(generatorId: string) {
  const [history, setHistory] = useState<HistoryItem<T>[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(`ts-tools-history-${generatorId}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
    }
  }, [generatorId]);

  // Save history item
  const saveHistory = (payload: T, prompt: string) => {
    const newItem: HistoryItem<T> = {
      id: crypto.randomUUID(),
      generatorId,
      timestamp: Date.now(),
      payload,
      prompt,
    };

    setHistory((prevHistory) => {
      const updatedHistory = [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(`ts-tools-history-${generatorId}`, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save history to localStorage', error);
      }

      return updatedHistory;
    });
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(`ts-tools-history-${generatorId}`);
    } catch (error) {
      console.error('Failed to clear history from localStorage', error);
    }
  };

  return {
    history,
    saveHistory,
    clearHistory,
  };
}
