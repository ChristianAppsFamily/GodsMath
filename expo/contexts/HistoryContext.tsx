import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { CalculationHistory } from '@/types/calculator';

const HISTORY_KEY = 'fastcalc_history';

export const [HistoryProvider, useHistory] = createContextHook(() => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.log('[HistoryContext] Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistory = async (newHistory: CalculationHistory[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.log('[HistoryContext] Error saving history:', error);
    }
  };

  const addToHistory = useCallback((entry: Omit<CalculationHistory, 'id' | 'timestamp'>) => {
    const newEntry: CalculationHistory = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 100);
      saveHistory(updated);
      return updated;
    });
    
    console.log('[HistoryContext] Added entry:', newEntry);
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
    console.log('[HistoryContext] History cleared');
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveHistory(updated);
      return updated;
    });
    console.log('[HistoryContext] Deleted entry:', id);
  }, []);

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    deleteEntry,
  };
});
