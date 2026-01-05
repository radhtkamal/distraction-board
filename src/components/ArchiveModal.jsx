import React, { useState, useMemo } from 'react';
import { X, AlertCircle, Download } from 'lucide-react';

const ArchiveModal = ({ isOpen, onClose, onArchive, entries, getArchivableEntries, calculateDataSize, defaultDays }) => {
  const [archiveDays, setArchiveDays] = useState(defaultDays);
  const [isArchiving, setIsArchiving] = useState(false);

  const archiveData = useMemo(() => {
    return getArchivableEntries(entries, archiveDays);
  }, [archiveDays, entries, getArchivableEntries]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const archivableSize = calculateDataSize(archiveData.archivable);
  const archivableCount = Object.values(archiveData.archivable).reduce(
    (sum, dayEntries) =>
      sum + Object.values(dayEntries).reduce((s, arr) => s + (arr?.length || 0), 0),
    0
  );

  const handleArchive = async () => {
    setIsArchiving(true);
    await onArchive(archiveData.archivable, archiveDays);
    setIsArchiving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Archive Old Entries</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Archiving moves old entries to a downloadable file and frees up storage on your device.
            </p>
          </div>

          {/* Days Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Archive entries older than:
            </label>
            <div className="flex gap-2">
              {[7, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setArchiveDays(days)}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    archiveDays === days
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
            <input
              type="number"
              value={archiveDays}
              onChange={(e) => setArchiveDays(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="365"
              className="mt-2 w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Or enter custom days"
            />
          </div>

          {/* Preview */}
          {archivableCount > 0 ? (
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-slate-700">What will be archived:</p>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  📅 <span className="font-medium">{Object.keys(archiveData.archivable).length}</span> dates
                </p>
                <p>
                  📝 <span className="font-medium">{archivableCount}</span> entries total
                </p>
                <p>
                  💾 <span className="font-medium">{formatBytes(archivableSize)}</span> of storage freed
                </p>
              </div>

              {/* Date Preview */}
              {Object.keys(archiveData.archivable).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-300">
                  <p className="text-xs font-medium text-slate-600 mb-1">Dates to archive:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(archiveData.archivable)
                      .sort()
                      .reverse()
                      .slice(0, 5)
                      .map((date) => (
                        <span key={date} className="text-xs bg-white px-2 py-1 rounded border border-slate-300">
                          {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ))}
                    {Object.keys(archiveData.archivable).length > 5 && (
                      <span className="text-xs px-2 py-1 text-slate-500">
                        +{Object.keys(archiveData.archivable).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-lg text-center text-sm text-slate-600">
              No entries older than {archiveDays} days to archive.
            </div>
          )}

          {/* Remaining Preview */}
          {Object.keys(archiveData.remaining).length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
              ✅ <span className="font-medium">{Object.keys(archiveData.remaining).length}</span> dates will remain active
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleArchive}
            disabled={isArchiving || archivableCount === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isArchiving ? 'Archiving...' : 'Archive & Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;

