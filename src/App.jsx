import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Briefcase, Brain, Home, Plus, X, Clock, Download, Calendar } from 'lucide-react';
import { useStorage } from './hooks/useStorage';
import DistractionBoard from './components/DistractionBoard';

function App() {
  const { entries, addEntry, removeEntry, clearCategory, exportData } = useStorage();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Get all available dates from localStorage
    const dates = Object.keys(entries).sort().reverse();
    setAvailableDates(dates);
  }, [entries]);

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

  const todayData = entries[selectedDate] || {};
  const totalCount = Object.values(todayData).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
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

            <button
              onClick={handleExport}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Distraction Board for Selected Date */}
        <DistractionBoard
          entries={todayData}
          selectedDate={selectedDate}
          onAddEntry={addEntry}
          onRemoveEntry={removeEntry}
          onClearCategory={clearCategory}
        />

        {/* Usage Guide */}
        <div className="mt-8 bg-white rounded-lg border-2 border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">How to use this tool</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p><span className="font-medium text-slate-700">During work:</span> When a thought intrudes, capture it here in 1-2 sentences. Then immediately return to work.</p>
            <p><span className="font-medium text-slate-700">After work:</span> Review your board once daily. Sort each item: needs action, needs processing, or can let go.</p>
            <p><span className="font-medium text-slate-700">History:</span> Your entries are saved by date. Use the date picker to review or revisit past entries.</p>
            <p><span className="font-medium text-slate-700">Export:</span> Download your complete history as a backup anytime.</p>
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
    </div>
  );
}

export default App;


