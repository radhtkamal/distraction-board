import { useState, useEffect, useCallback } from "react";

const QUOTA_WARNING_THRESHOLD = 0.8; // Warn at 80% usage
const DEFAULT_ARCHIVE_DAYS = 30; // Archive entries older than 30 days by default
const DB_NAME = "DistractionBoardDB";
const STORE_NAME = "entries";

export function useStorageQuota() {
  const [quotaInfo, setQuotaInfo] = useState({
    usage: 0,
    quota: 0,
    percentage: 0,
    showWarning: false,
    idbUsage: 0,
  });
  const [archiveDays, setArchiveDays] = useState(DEFAULT_ARCHIVE_DAYS);

  // Request persistent storage (increases quota on iOS Safari)
  const requestPersistentStorage = async () => {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log("Persistent storage granted:", isPersisted);
        return isPersisted;
      }
    } catch (error) {
      console.error("Failed to request persistent storage:", error);
    }
    return false;
  };

  // Get actual IndexedDB usage by checking database size
  const getIndexedDBUsage = async () => {
    try {
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(0), 1000); // 1 second timeout
      });

      const idbPromise = (async () => {
        try {
          const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });

          return new Promise((resolve) => {
            try {
              const transaction = db.transaction([STORE_NAME], "readonly");
              const store = transaction.objectStore(STORE_NAME);
              const request = store.get("all-entries");

              request.onsuccess = () => {
                const entry = request.result;
                db.close();
                if (entry?.data) {
                  const size = new Blob([JSON.stringify(entry.data)]).size;
                  resolve(size);
                } else {
                  resolve(0);
                }
              };

              request.onerror = () => {
                db.close();
                resolve(0);
              };
            } catch (e) {
              db.close();
              resolve(0);
            }
          });
        } catch (error) {
          return 0;
        }
      })();

      return Promise.race([idbPromise, timeoutPromise]);
    } catch (error) {
      console.warn("Could not calculate IndexedDB usage:", error);
      return 0;
    }
  };

  // Check storage quota
  const checkQuota = useCallback(async () => {
    try {
      const idbUsage = await getIndexedDBUsage();

      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        let usage = estimate.usage || idbUsage;
        let quota = estimate.quota || 0;
        let quotaSource = "API";

        if (quota === 0 || quota === undefined) {
          quota = 50 * 1024 * 1024;
          quotaSource = "iOS_FALLBACK";
        }

        usage = Math.max(usage, idbUsage);
        const percentage = quota > 0 ? (usage / quota) * 100 : 0;

        setQuotaInfo({
          usage,
          quota,
          percentage: isFinite(percentage) ? percentage : 0,
          showWarning: percentage >= QUOTA_WARNING_THRESHOLD * 100,
          idbUsage,
          quotaSource,
        });
      }
    } catch (error) {
      console.error("Failed to check storage quota:", error);
    }
  }, []);

  // Get entries to archive (older than X days)
  const getArchivableEntries = (entries, days = archiveDays) => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

    const archivable = {};
    const remaining = {};

    Object.entries(entries).forEach(([date, dayEntries]) => {
      if (date < cutoffDateStr) {
        archivable[date] = dayEntries;
      } else {
        remaining[date] = dayEntries;
      }
    });

    return { archivable, remaining };
  };

  // Calculate size of data (rough estimation)
  const calculateDataSize = (data) => {
    const jsonStr = JSON.stringify(data);
    return new Blob([jsonStr]).size;
  };

  // Check quota on mount only
  useEffect(() => {
    checkQuota();
    requestPersistentStorage();
  }, []);

  return {
    quotaInfo,
    checkQuota,
    requestPersistentStorage,
    getArchivableEntries,
    calculateDataSize,
    archiveDays,
    setArchiveDays,
  };
}
