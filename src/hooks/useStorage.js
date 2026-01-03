import { useState, useEffect } from 'react';

const STORAGE_KEY = 'distraction-board-entries';

export function useStorage() {
  const [entries, setEntries] = useState({});

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadEntries = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEntries(JSON.parse(stored));
        } else {
          // Initialize with today's date if empty
          const today = new Date().toISOString().split('T')[0];
          const initialEntries = {
            [today]: {
              relationships: [],
              school: [],
              work: [],
              emotional: [],
              life: []
            }
          };
          setEntries(initialEntries);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEntries));
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };

    loadEntries();
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(entries).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const ensureDateExists = (date) => {
    if (!entries[date]) {
      const newEntries = {
        ...entries,
        [date]: {
          relationships: [],
          school: [],
          work: [],
          emotional: [],
          life: []
        }
      };
      setEntries(newEntries);
      return newEntries;
    }
    return entries;
  };

  const addEntry = (date, categoryId, text) => {
    const currentEntries = ensureDateExists(date);
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const newEntries = {
      ...currentEntries,
      [date]: {
        ...currentEntries[date],
        [categoryId]: [
          ...(currentEntries[date][categoryId] || []),
          {
            id: Date.now(),
            text,
            timestamp
          }
        ]
      }
    };

    setEntries(newEntries);
  };

  const removeEntry = (date, categoryId, entryId) => {
    if (!entries[date]) return;

    const newEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].filter(e => e.id !== entryId)
      }
    };

    setEntries(newEntries);
  };

  const clearCategory = (date, categoryId) => {
    if (!entries[date]) return;

    const newEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: []
      }
    };

    setEntries(newEntries);
  };

  const exportData = () => {
    return {
      exportedAt: new Date().toISOString(),
      data: entries
    };
  };

  return {
    entries,
    addEntry,
    removeEntry,
    clearCategory,
    exportData
  };
}




