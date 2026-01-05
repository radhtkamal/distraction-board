import React from 'react';
import { AlertCircle, HardDrive } from 'lucide-react';

const StorageQuotaBar = ({ quotaInfo, onArchiveClick, calculateDataSize, entries }) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentSize = calculateDataSize(entries);
  const warningLevel = quotaInfo.percentage >= 80;
  const criticalLevel = quotaInfo.percentage >= 95;

  return (
    <div className="mb-6">
      {/* Storage Stats */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Storage Usage</span>
        </div>
        <span className="text-xs text-slate-600">
          {formatBytes(quotaInfo.usage)} / {formatBytes(quotaInfo.quota)}
          {' '}
          <span className={`font-semibold ${criticalLevel ? 'text-red-600' : warningLevel ? 'text-amber-600' : 'text-slate-600'}`}>
            ({quotaInfo.percentage.toFixed(1)}%)
          </span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all ${
            criticalLevel
              ? 'bg-red-500'
              : warningLevel
              ? 'bg-amber-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(quotaInfo.percentage, 100)}%` }}
        />
      </div>

      {/* Warning Message */}
      {warningLevel && (
        <div className={`p-3 rounded-lg border ${
          criticalLevel
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        } flex items-start gap-2`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm mb-2">
              {criticalLevel ? '⚠️ Storage Almost Full!' : '📦 Storage Getting Full'}
            </p>
            <p className="text-xs mb-2">
              Your distraction board is using {formatBytes(currentSize)} of storage.
              Archive old entries to free up space.
            </p>
            <button
              onClick={onArchiveClick}
              className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                criticalLevel
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              Archive Old Entries
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageQuotaBar;

