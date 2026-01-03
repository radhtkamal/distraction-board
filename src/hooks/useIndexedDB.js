import { useState, useEffect } from "react";

const DB_NAME = "DistractionBoardDB";
const DB_VERSION = 1;
const STORE_NAME = "entries";

export function useIndexedDB() {
  const [db, setDb] = useState(null);
  const [entries, setEntries] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          console.error("Database failed to open");
          setIsLoading(false);
        };

        request.onsuccess = () => {
          const database = request.result;
          setDb(database);
          loadAllEntries(database);
        };

        request.onupgradeneeded = (event) => {
          const database = event.target.result;
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME);
          }
        };
      } catch (error) {
        console.error("IndexedDB not available:", error);
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const loadAllEntries = (database) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get("all-entries");

    request.onsuccess = () => {
      const data = request.result?.data || {};
      setEntries(data);
      setIsLoading(false);
    };

    request.onerror = () => {
      console.error("Failed to load entries");
      setIsLoading(false);
    };
  };

  const saveEntries = async (updatedEntries) => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put({ data: updatedEntries }, "all-entries");

      request.onsuccess = () => {
        setEntries(updatedEntries);
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to save entries");
        reject();
      };
    });
  };

  const addEntry = async (date, categoryId, text) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const updatedEntries = {
      ...entries,
      [date]: {
        ...(entries[date] || {
          relationships: [],
          school: [],
          work: [],
          emotional: [],
          life: [],
        }),
        [categoryId]: [
          ...(entries[date]?.[categoryId] || []),
          {
            id: Date.now(),
            text,
            timestamp,
          },
        ],
      },
    };

    await saveEntries(updatedEntries);
  };

  const removeEntry = async (date, categoryId, entryId) => {
    if (!entries[date]) return;

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].filter((e) => e.id !== entryId),
      },
    };

    await saveEntries(updatedEntries);
  };

  const clearCategory = async (date, categoryId) => {
    if (!entries[date]) return;

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: [],
      },
    };

    await saveEntries(updatedEntries);
  };

  const exportData = () => {
    return {
      exportedAt: new Date().toISOString(),
      data: entries,
    };
  };

  const importData = async (jsonData) => {
    try {
      const parsedData =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      await saveEntries(parsedData.data || parsedData);
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  };

  return {
    entries,
    addEntry,
    removeEntry,
    clearCategory,
    exportData,
    importData,
    isLoading,
  };
}

