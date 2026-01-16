import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Briefcase, Brain, Home, Plus, X, Clock, Download, Calendar, Upload } from 'lucide-react';
import { useIndexedDB } from './hooks/useIndexedDB';
import { useStorageQuota } from './hooks/useStorageQuota';
import DistractionBoard from './components/DistractionBoard';
import StorageQuotaBar from './components/StorageQuotaBar';
import ArchiveModal from './components/ArchiveModal';

function App() {
  const { entries, addEntry, removeEntry, clearCategory, toggleEntryCheck, addSubEntry, removeSubEntry, toggleSubEntryCheck, exportData, importData, archiveEntries, isLoading } = useIndexedDB();
  const { quotaInfo, checkQuota, getArchivableEntries, calculateDataSize, archiveDays, setArchiveDays } = useStorageQuota();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    // Get all available dates from localStorage
    const dates = Object.keys(entries).sort().reverse();
    setAvailableDates(dates);
    // Check quota after entries update
    checkQuota();
  }, [entries, checkQuota]);

  const handleExport = () => {
    const dataStr = JSON.stringify(exportData(), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distraction-board-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const jsonData = e.target?.result;
      const success = await importData(jsonData);
      if (success) {
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
        checkQuota(); // Re-check quota after import
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleArchive = async (entriesToArchive, days) => {
    const archivedData = await archiveEntries(entriesToArchive);
    
    // Auto-download the archived data
    const dataStr = JSON.stringify(archivedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distraction-board-archive-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 3000);
    
    // Re-check quota after archiving
    await checkQuota();
  };

  const todayData = entries[selectedDate] || {};
  const totalCount = Object.values(todayData).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-slate-600 mb-4">Loading your board...</div>
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Import Success Message */}
        {showImportSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✅ {selectedDate !== new Date().toISOString().split('T')[0] ? 'Data archived successfully!' : 'Data imported successfully! Your board has been restored.'}
          </div>
        )}

        {/* Storage Quota Bar */}
        {!isLoading && (
          <StorageQuotaBar
            quotaInfo={quotaInfo}
            onArchiveClick={() => setShowArchiveModal(true)}
            calculateDataSize={calculateDataSize}
            entries={entries}
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Distraction Board</h1>
          <p className="text-slate-600">Capture intrusive thoughts during work. Review once daily outside work hours.</p>
          
          {/* Date Navigation & Stats */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">{totalCount} thoughts captured</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-sm text-slate-900 border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {selectedDate !== new Date().toISOString().split('T')[0] && (
                <span className="text-xs text-slate-500 ml-2">(Past entry)</span>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Distraction Board for Selected Date */}
        <DistractionBoard
          entries={todayData}
          selectedDate={selectedDate}
          onAddEntry={addEntry}
          onRemoveEntry={removeEntry}
          onClearCategory={clearCategory}
          onToggleEntry={toggleEntryCheck}
          onAddSubEntry={addSubEntry}
          onRemoveSubEntry={removeSubEntry}
          onToggleSubEntry={toggleSubEntryCheck}
        />

        {/* Usage Guide */}
        <div className="mt-8 bg-white rounded-lg border-2 border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">How to use this tool</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p><span className="font-medium text-slate-700">During work:</span> When a thought intrudes, capture it here in 1-2 sentences. Then immediately return to work.</p>
            <p><span className="font-medium text-slate-700">After work:</span> Review your board once daily. Sort each item: needs action, needs processing, or can let go.</p>
            <p><span className="font-medium text-slate-700">History:</span> Your entries are saved by date. Use the date picker to review or revisit past entries.</p>
            <p><span className="font-medium text-slate-700">Storage:</span> Data is stored in IndexedDB (more reliable than localStorage, works offline, persists across sessions).</p>
            <p><span className="font-medium text-slate-700">Backup:</span> Export your data regularly as JSON backup. Use Import to restore if needed.</p>
            <p><span className="font-medium text-slate-700">Archive:</span> When storage is full, archive old entries to free up space. Archives are downloaded automatically.</p>
            <p><span className="font-medium text-slate-700">Rule:</span> Capture = relief. Reviewing during work = sabotage. Trust the system.</p>
          </div>
        </div>

        {/* Date History */}
        {availableDates.length > 1 && (
          <div className="mt-8 bg-white rounded-lg border-2 border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Your history</h3>
            <div className="flex flex-wrap gap-2">
              {availableDates.map(date => {
                const dateEntries = entries[date];
                const count = Object.values(dateEntries).reduce((sum, arr) => sum + (arr?.length || 0), 0);
                const isSelected = date === selectedDate;
                
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' '}
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Archive Modal */}
      <ArchiveModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onArchive={handleArchive}
        entries={entries}
        getArchivableEntries={getArchivableEntries}
        calculateDataSize={calculateDataSize}
        defaultDays={archiveDays}
      />
    </div>
  );
}

export default App;


