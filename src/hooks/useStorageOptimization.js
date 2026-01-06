import { useState, useCallback } from "react";

const DB_NAME = "DistractionBoardDB";
const STORE_NAME = "entries";

/**
 * Hook for aggressively managing storage on iOS and memory-constrained devices
 * Automatically removes oldest entries when storage gets critical
 */
export function useStorageOptimization() {
  const [optimizationLog, setOptimizationLog] = useState([]);

  // Clean very old entries (older than 90 days)
  const cleanOldEntries = useCallback(async (entries, daysThreshold = 90) => {
    try {
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);
      const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

      const initialSize = JSON.stringify(entries).length;
      
      const cleanedEntries = {};
      let removedCount = 0;

      Object.entries(entries).forEach(([date, dayEntries]) => {
        if (date >= cutoffDateStr) {
          cleanedEntries[date] = dayEntries;
        } else {
          // Count how many entries we're removing
          removedCount += Object.values(dayEntries).reduce((sum, arr) => sum + (arr?.length || 0), 0);
        }
      });

      const finalSize = JSON.stringify(cleanedEntries).length;
      const savedBytes = initialSize - finalSize;

      const logEntry = {
        action: "clean_old_entries",
        timestamp: new Date().toISOString(),
        daysThreshold,
        removedCount,
        savedBytes,
        success: true,
      };

      setOptimizationLog(prev => [...prev, logEntry]);
      console.log("Storage optimization:", logEntry);

      return { cleanedEntries, removedCount, savedBytes };
    } catch (error) {
      console.error("Failed to clean old entries:", error);
      return { cleanedEntries: entries, removedCount: 0, savedBytes: 0 };
    }
  }, []);

  // Compress data: remove empty day entries
  const compressEntries = useCallback((entries) => {
    try {
      const initialSize = JSON.stringify(entries).length;

      const compressed = {};
      let removedDays = 0;

      Object.entries(entries).forEach(([date, dayEntries]) => {
        // Check if day has any non-empty categories
        const hasContent = Object.values(dayEntries).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );

        if (hasContent) {
          compressed[date] = dayEntries;
        } else {
          removedDays++;
        }
      });

      const finalSize = JSON.stringify(compressed).length;
      const savedBytes = initialSize - finalSize;

      const logEntry = {
        action: "compress_entries",
        timestamp: new Date().toISOString(),
        removedEmptyDays: removedDays,
        savedBytes,
        success: true,
      };

      setOptimizationLog(prev => [...prev, logEntry]);
      console.log("Storage compression:", logEntry);

      return { compressedEntries: compressed, removedDays, savedBytes };
    } catch (error) {
      console.error("Failed to compress entries:", error);
      return { compressedEntries: entries, removedDays: 0, savedBytes: 0 };
    }
  }, []);

  // Emergency cleanup: keep only last 30 days
  const emergencyCleanup = useCallback(async (entries) => {
    console.warn("⚠️ EMERGENCY CLEANUP: Keeping only last 30 days");
    try {
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

      const emergencyEntries = {};
      Object.entries(entries).forEach(([date, dayEntries]) => {
        if (date >= cutoffDateStr) {
          emergencyEntries[date] = dayEntries;
        }
      });

      const logEntry = {
        action: "emergency_cleanup",
        timestamp: new Date().toISOString(),
        retainedDays: Object.keys(emergencyEntries).length,
        success: true,
      };

      setOptimizationLog(prev => [...prev, logEntry]);
      return emergencyEntries;
    } catch (error) {
      console.error("Emergency cleanup failed:", error);
      return entries;
    }
  }, []);

  // Check if we need optimization based on current usage
  const shouldOptimize = useCallback((percentage) => {
    return percentage > 85; // Optimize when above 85%
  }, []);

  // Get optimization recommendations
  const getOptimizationSteps = useCallback((entries, percentage) => {
    const steps = [];

    if (percentage > 95) {
      steps.push({
        priority: "CRITICAL",
        action: "emergencyCleanup",
        message: "⚠️ CRITICAL: Keep only last 30 days to free up space immediately",
      });
    }

    if (percentage > 85) {
      steps.push({
        priority: "HIGH",
        action: "cleanOldEntries",
        message: "Remove entries older than 90 days",
      });
      steps.push({
        priority: "HIGH",
        action: "compressEntries",
        message: "Remove empty days",
      });
    }

    if (percentage > 70) {
      steps.push({
        priority: "MEDIUM",
        action: "compressEntries",
        message: "Clean up empty days",
      });
    }

    return steps;
  }, []);

  return {
    cleanOldEntries,
    compressEntries,
    emergencyCleanup,
    shouldOptimize,
    getOptimizationSteps,
    optimizationLog,
  };
}

