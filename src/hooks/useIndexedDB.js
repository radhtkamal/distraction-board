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

      request.onerror = (error) => {
        console.error("Failed to save entries:", error);
        // Check if it's a quota exceeded error
        if (error.target.error?.name === "QuotaExceededError") {
          reject(new Error("STORAGE_QUOTA_EXCEEDED"));
        } else {
          reject(error);
        }
      };
    });
  };

  const addEntry = async (date, categoryId, text) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const createdDate = now.toISOString().split("T")[0];

    const updatedEntries = {
      ...entries,
      [date]: {
        ...(entries[date] || {
          relationships: [],
          school: [],
          work: [],
          emotional: [],
          life: [],
          upskilling: [],
        }),
        [categoryId]: [
          ...(entries[date]?.[categoryId] || []),
          {
            id: Date.now(),
            text,
            timestamp,
            createdDate,
            checked: false, // NEW: Default to unchecked for new entries
            subEntries: [], // Initialize empty sub-entries array
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

  const toggleEntryCheck = async (date, categoryId, entryId) => {
    if (!entries[date]) {
      console.error("Date not found in entries:", date);
      return;
    }

    if (!entries[date][categoryId]) {
      console.error("Category not found:", categoryId);
      return;
    }

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].map((entry) => {
          if (entry.id === entryId) {
            // Defensive: Use ?? false to handle undefined checked property from old entries
            const currentChecked = entry.checked ?? false;
            const newCheckedState = !currentChecked;
            
            // Generate completion timestamps when checking, clear when unchecking
            const now = new Date();
            const completedDate = newCheckedState ? now.toISOString().split("T")[0] : undefined;
            const completedTime = newCheckedState ? now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }) : undefined;
            
            // When toggling main entry, also toggle all sub-entries
            const subEntries = (entry.subEntries ?? []).map(subEntry => {
              const subNow = new Date();
              const subCompletedDate = newCheckedState ? subNow.toISOString().split("T")[0] : undefined;
              const subCompletedTime = newCheckedState ? subNow.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }) : undefined;
              
              return {
                ...subEntry,
                checked: newCheckedState,
                completedDate: subCompletedDate,
                completedTime: subCompletedTime,
              };
            });
            
            const updatedEntry = { 
              ...entry, 
              checked: newCheckedState,
              completedDate,
              completedTime,
              subEntries
            };
            console.log(
              `[Checkbox Toggle] Entry ${entryId}: ${currentChecked} -> ${newCheckedState}`
            );
            return updatedEntry;
          }
          return entry;
        }),
      },
    };

    try {
      await saveEntries(updatedEntries);
    } catch (error) {
      console.error("Failed to toggle entry check:", error);
      throw error;
    }
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

  const archiveEntries = async (entriesToArchive) => {
    // Keep only entries not being archived
    const archivedKeys = Object.keys(entriesToArchive);
    const remainingEntries = {};
    
    Object.entries(entries).forEach(([date, dayEntries]) => {
      if (!archivedKeys.includes(date)) {
        remainingEntries[date] = dayEntries;
      }
    });

    await saveEntries(remainingEntries);
    
    return {
      exportedAt: new Date().toISOString(),
      data: entriesToArchive,
      archivedCount: Object.values(entriesToArchive).reduce(
        (sum, dayEntries) =>
          sum +
          Object.values(dayEntries).reduce((s, arr) => s + (arr?.length || 0), 0),
        0
      ),
    };
  };

  const mergeArchiveWithCurrent = async (archiveData) => {
    const mergedEntries = {
      ...archiveData,
      ...entries,
    };
    await saveEntries(mergedEntries);
  };

  const addSubEntry = async (date, categoryId, entryId, text) => {
    if (!entries[date] || !entries[date][categoryId]) {
      console.error("Date or category not found");
      return;
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const createdDate = now.toISOString().split("T")[0];

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].map((entry) => {
          if (entry.id === entryId) {
            const subEntries = (entry.subEntries ?? []) || [];
            return {
              ...entry,
              subEntries: [
                ...subEntries,
                {
                  id: Date.now(),
                  text,
                  timestamp,
                  createdDate,
                  checked: false,
                },
              ],
            };
          }
          return entry;
        }),
      },
    };

    await saveEntries(updatedEntries);
  };

  const removeSubEntry = async (date, categoryId, entryId, subEntryId) => {
    if (!entries[date] || !entries[date][categoryId]) {
      console.error("Date or category not found");
      return;
    }

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].map((entry) => {
          if (entry.id === entryId) {
            const subEntries = (entry.subEntries ?? []) || [];
            return {
              ...entry,
              subEntries: subEntries.filter((subEntry) => subEntry.id !== subEntryId),
            };
          }
          return entry;
        }),
      },
    };

    await saveEntries(updatedEntries);
  };

  const toggleSubEntryCheck = async (date, categoryId, entryId, subEntryId) => {
    if (!entries[date] || !entries[date][categoryId]) {
      console.error("Date or category not found");
      return;
    }

    const updatedEntries = {
      ...entries,
      [date]: {
        ...entries[date],
        [categoryId]: entries[date][categoryId].map((entry) => {
          if (entry.id === entryId) {
            const subEntries = (entry.subEntries ?? []) || [];
            return {
              ...entry,
              subEntries: subEntries.map((subEntry) => {
                if (subEntry.id === subEntryId) {
                  const currentChecked = subEntry.checked ?? false;
                  const newCheckedState = !currentChecked;
                  
                  // Generate completion timestamps when checking, clear when unchecking
                  const now = new Date();
                  const completedDate = newCheckedState ? now.toISOString().split("T")[0] : undefined;
                  const completedTime = newCheckedState ? now.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }) : undefined;
                  
                  console.log(
                    `[Sub-entry Toggle] SubEntry ${subEntryId}: ${currentChecked} -> ${newCheckedState}`
                  );
                  return { 
                    ...subEntry, 
                    checked: newCheckedState,
                    completedDate,
                    completedTime,
                  };
                }
                return subEntry;
              }),
            };
          }
          return entry;
        }),
      },
    };

    try {
      await saveEntries(updatedEntries);
    } catch (error) {
      console.error("Failed to toggle sub-entry check:", error);
      throw error;
    }
  };

  return {
    entries,
    addEntry,
    removeEntry,
    clearCategory,
    toggleEntryCheck,
    addSubEntry,
    removeSubEntry,
    toggleSubEntryCheck,
    exportData,
    importData,
    archiveEntries,
    mergeArchiveWithCurrent,
    isLoading,
  };
}


