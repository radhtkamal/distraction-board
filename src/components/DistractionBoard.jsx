import React, { useState } from 'react';
import { Heart, BookOpen, Briefcase, Brain, Home, Plus, X } from 'lucide-react';

const DistractionBoard = ({ entries, selectedDate, onAddEntry, onRemoveEntry, onClearCategory }) => {
  const categories = [
    { id: 'relationships', name: 'Relationships / Social', icon: Heart, color: 'bg-rose-50 border-rose-200' },
    { id: 'school', name: 'School / Learning', icon: BookOpen, color: 'bg-blue-50 border-blue-200' },
    { id: 'work', name: 'Work / Career', icon: Briefcase, color: 'bg-purple-50 border-purple-200' },
    { id: 'emotional', name: 'Emotional / Mental', icon: Brain, color: 'bg-amber-50 border-amber-200' },
    { id: 'life', name: 'Life Admin', icon: Home, color: 'bg-green-50 border-green-200' }
  ];

  const [newEntry, setNewEntry] = useState({});
  const [isAdding, setIsAdding] = useState({});
  const [error, setError] = useState(null);

  const handleAddEntry = async (categoryId) => {
    const text = newEntry[categoryId]?.trim();
    if (!text) return;

    try {
      setError(null);
      await onAddEntry(selectedDate, categoryId, text);
      setNewEntry({ ...newEntry, [categoryId]: '' });
      setIsAdding({ ...isAdding, [categoryId]: false });
    } catch (err) {
      console.error("Error adding entry:", err);
      if (err.message === "STORAGE_QUOTA_EXCEEDED") {
        setError("Storage is full! Please archive old entries to make space.");
      } else {
        setError("Failed to save entry. Please try again.");
      }
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm font-medium">⚠️ {error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(category => {
        const Icon = category.icon;
        const categoryEntries = entries[category.id] || [];
        const isAddingEntry = isAdding[category.id];

        return (
          <div 
            key={category.id} 
            className={`${category.color} border-2 rounded-lg p-4 transition-all hover:shadow-md`}
          >
            {/* Category Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-slate-700" />
                <h2 className="font-semibold text-slate-800">{category.name}</h2>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full">
                {categoryEntries.length}
              </span>
            </div>

            {/* Entries List */}
            <div className="space-y-2 mb-3 min-h-[60px]">
              {categoryEntries.map(entry => (
                <div 
                  key={entry.id}
                  className="bg-white rounded p-2.5 text-sm text-slate-700 flex items-start justify-between gap-2 group"
                >
                  <div className="flex-1">
                    <p className="leading-snug">{entry.text}</p>
                    <span className="text-xs text-slate-400 mt-1 inline-block">{entry.timestamp}</span>
                  </div>
                  <button
                    onClick={() => onRemoveEntry(selectedDate, category.id, entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Entry Section */}
            {isAddingEntry ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Quick capture (keep it short)..."
                  value={newEntry[category.id] || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, [category.id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEntry(category.id)}
                  className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddEntry(category.id)}
                    className="flex-1 px-3 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding({ ...isAdding, [category.id]: false });
                      setNewEntry({ ...newEntry, [category.id]: '' });
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding({ ...isAdding, [category.id]: true })}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add thought
                </button>
                {categoryEntries.length > 0 && (
                  <button
                    onClick={() => onClearCategory(selectedDate, category.id)}
                    className="px-3 py-2 bg-white border border-slate-300 text-slate-500 text-xs rounded hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
};

export default DistractionBoard;


