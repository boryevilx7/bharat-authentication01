import { useState, useEffect } from 'react';
import { ScanResult } from '@/utils/mockApi';

const STORAGE_KEY = 'scan_history';
const MAX_HISTORY_ITEMS = 50;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(withDates);
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save scan history:', error);
    }
  }, [history]);

  const addScan = (scan: ScanResult) => {
    setHistory((prev) => {
      const updated = [scan, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeScan = (id: string) => {
    setHistory((prev) => prev.filter((scan) => scan.id !== id));
  };

  return {
    history,
    addScan,
    clearHistory,
    removeScan,
  };
}
