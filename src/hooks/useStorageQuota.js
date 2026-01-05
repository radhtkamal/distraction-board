import { useState, useEffect } from "react";

const QUOTA_WARNING_THRESHOLD = 0.8; // Warn at 80% usage
const DEFAULT_ARCHIVE_DAYS = 30; // Archive entries older than 30 days by default

export function useStorageQuota() {
  const [quotaInfo, setQuotaInfo] = useState({
    usage: 0,
    quota: 0,
    percentage: 0,
    showWarning: false,
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

  // Check storage quota
  const checkQuota = async () => {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (usage / quota) * 100 : 0;

        const newQuotaInfo = {
          usage,
          quota,
          percentage,
          showWarning: percentage >= QUOTA_WARNING_THRESHOLD * 100,
        };

        setQuotaInfo(newQuotaInfo);
        return newQuotaInfo;
      }
    } catch (error) {
      console.error("Failed to check storage quota:", error);
    }
    return quotaInfo;
  };

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

  // Check quota on mount
  useEffect(() => {
    checkQuota();
    // Request persistent storage on first load
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

